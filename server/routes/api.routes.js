import express from 'express';
import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator';

import pangolinSchema from '../models/Pangolin.js';
import authorize from '../middlewares/auth.js';
import Pangolin from '../models/Pangolin.js';
import Friend from '../models/Friend.js';
import mongoose from 'mongoose';

const router = express.Router();

// Register a Pangolin
router.post(
    '/register',
    [
        check('name')
            .not()
            .isEmpty()
            .isLength({ min: 4 })
            .withMessage('Votre nom doit avoir au moins 4 caractères'),
        check('email', 'Une adresse email est requise.').not().isEmpty(),
        check('password', 'Votre mot de passe doit contenir entre 8 et 32 caractères')
            .not()
            .isEmpty()
            .isLength({ min: 8, max: 32 })
    ],
    (req, res, next) => {
        const errors = validationResult(req)

        console.log(req.body); //LOG

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array())
        } else {
            bcrypt.hash(req.body.password, 10).then((hash) => {
                const pangolin = new pangolinSchema({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    role: req.body.role,
                })
                pangolin
                    .save({ runValidators: true })
                    .then((response) => {
                        res.status(201).json({
                            message: 'Pangolin créé.',
                            result: response,
                        })
                    })
                    .catch((error) => {
                        res.status(500).json({
                            error: error,
                        })
                    })
            })
        }
    },
);

// Login a Pangolin
router.post('/login', (req, res, next) => {
    let getPangolin
    pangolinSchema
        .findOne({
            email: req.body.email,
        }, function (err, pangolin) {
            if (err) return next(err);
            if (!pangolin || !pangolin.comparePasswords(req.body.password)) {
                return res.status(401).json({
                    message: 'Authentification échouée',
                });
            }
            return res.status(200).json({
                token: pangolin.generateAuthToken(),
                expiresIn: 3600 * 24,
                _id: pangolin._id,
            });
        })
});

// Get Pangolins
router.route('/pangolins').get((req, res, next) => {
    pangolinSchema.find().select('_id name').exec((error, response) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json(response);
        }
    })
});

// Get Single Pangolin
router.route('/pangolin').get(authorize, (req, res, next) => {
    pangolinSchema.findById(req.pangolin.id).select('_id name email role').exec( (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json(data);
        }
    })
});

// Update pangolin
router.route('/update-pangolin').put(authorize, (req, res, next) => {
    pangolinSchema.findByIdAndUpdate(
        req.pangolin.id,
        {
            $set: req.body,
        },
        { runValidators: true },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
                console.log('Pangolin mis à jour avec succès !'); //LOG
            }
        },
    )
});

// Delete pangolin
router.route('/delete-pangolin').delete(authorize, (req, res, next) => {
    pangolinSchema.findByIdAndRemove(req.pangolin.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json(data);
        }
    })
});

// request pangolin as friend
router.route('/friend/request/:id').post(authorize, async (req, res, next) => {
    
    const requester = req.pangolin.id; //Pangolin A
    const recipient = req.params.id; //Pangolin B

    try {
        const friendA = await Friend.findOneAndUpdate(
            { requester: requester, recipient: recipient },
            { $set: { status: 1 } },
            { upsert: true, new: true }
        );
        const friendB = await Friend.findOneAndUpdate(
            { recipient: requester, requester: recipient },
            { $set: { status: 2 } },
            { upsert: true, new: true }
        );
        
        const updatePangolinA = await Pangolin.findOneAndUpdate(
            { _id: requester },
            { $push: { friends: friendA._id } }
        );
        const updatePangolinB = await Pangolin.findOneAndUpdate(
            { _id: recipient },
            { $push: { friends: friendB._id } }
        );
        
        Promise.allSettled([friendA, friendB, updatePangolinA, updatePangolinB])
            .then(() => {
                res.status(200).json({success: true});
            }).catch((err) => {
                return next(err);
            });
    } catch (error) {
        return next(error);
    }
});

// accept pangolin as friend
router.route('/friend/accept/:id').post(authorize, async (req, res, next) => {
    
    const requester = req.pangolin.id; //Pangolin A
    const recipient = req.params.id; //Pangolin B

    const friendA = Friend.findOneAndUpdate(
        { requester: requester, recipient: recipient },
        { $set: { status: 3 }}
    )
    const friendB = Friend.findOneAndUpdate(
        { recipient: requester, requester: recipient },
        { $set: { status: 3 }}
    )

    Promise.allSettled([friendA, friendB])
        .then(() => {
            res.status(200).json({success: true});
        }).catch((err) => {
            return next(err);
        });
});

// reject pangolin as friend
router.route('/friend/reject/:id').post(authorize, async (req, res, next) => {
    
    const requester = req.pangolin.id; //Pangolin A
    const recipient = req.params.id; //Pangolin B

    try {
        const friendA = await Friend.findOneAndRemove(
            { requester: requester, recipient: recipient }
        )
        const friendB = await Friend.findOneAndRemove(
            { recipient: requester, requester: recipient }
        )
    
        const updatePangolinA = await Pangolin.findOneAndUpdate(
            { _id: requester },
            { $pull: { friends: friendA._id }}
        )
        const updatePangolinB = await Pangolin.findOneAndUpdate(
            { _id: recipient },
            { $pull: { friends: friendB._id }}
        )
        
        Promise.allSettled([friendA, friendB, updatePangolinA, updatePangolinB])
            .then(() => {
                res.status(200).json({success: true});
            }).catch((err) => {
                return next(err);
            });
    } catch (error) {
        return next(error);
    }
});

// delete pangolin as friend
router.route('/friend/delete/:id').post(authorize, async (req, res, next) => {
    
    const requester = req.pangolin.id; //Pangolin A
    const recipient = req.params.id; //Pangolin B

    try {
        const friendA = await Friend.findOneAndRemove(
            { requester: requester, recipient: recipient }
        )
        const friendB = await Friend.findOneAndRemove(
            { recipient: requester, requester: recipient }
        )
    
        const updatePangolinA = await Pangolin.findOneAndUpdate(
            { _id: requester },
            { $pull: { friends: friendA._id }}
        )
        const updatePangolinB = await Pangolin.findOneAndUpdate(
            { _id: recipient },
            { $pull: { friends: friendB._id }}
        )
        
        Promise.allSettled([friendA, friendB, updatePangolinA, updatePangolinB])
            .then(() => {
                res.status(200).json({success: true});
            }).catch((err) => {
                return next(err);
            });
    } catch (error) {
        return next(error);
    }
});

// list my pangolin friends
router.route('/friends').get(authorize, async (req, res, next) => {
    const myFriends = [];

    const friends = await Pangolin.aggregate([
        {
            "$lookup": {
                "from": Friend.collection.name,
                "let": { "friends": "$friends" },
                "pipeline": [
                    {
                        "$match": {
                            "recipient": mongoose.Types.ObjectId(req.pangolin.id),
                            "$expr": { "$in": ["$_id", "$$friends"] }
                        }
                    },
                    { "$project": { "status": 1 } }
                ],
                "as": "friends"
            }
        },
        {
            "$addFields": {
                "friendsStatus": {
                    "$ifNull": [{ "$min": "$friends.status" }, 0]
                }
            }
        }
    ]);
    for (const friend of friends) {
        if (friend.friendsStatus > 0) myFriends.push({
            id: friend._id,
            name: friend.name,
            friendsStatus: friend.friendsStatus,
        })
    }
    res.status(200).json(myFriends);
});

export default router;