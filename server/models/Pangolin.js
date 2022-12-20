import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Schema = mongoose.Schema;

let pangolinSchema = new Schema({
    name: {
        type: String,
        required: [true, "ne peut pas être vide"], match: [/^[a-zA-Z0-9]+$/, 'est invalide'],
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "ne peut pas être vide"], match: [/\S+@\S+\.\S+/, 'est invalide'],
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['GUERRIER', 'ALCHIMISTE', 'SORCIER', 'ESPION', 'ENCHANTEUR'],
        default: 'GUERRIER',
    },
    friends: [{ type: Schema.Types.ObjectId, ref: 'Friends'}]
}, {
    collection: 'pangolins'
});

pangolinSchema.plugin(uniqueValidator, { message: 'est déjà utilisé.' });

pangolinSchema.methods.generateAuthToken = function () {
    const pangolin = this;
    const token = jwt.sign(
        {
            email: pangolin.email,
            userId: pangolin._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h',
        },
    );
    return token;
};

pangolinSchema.methods.comparePasswords = function (password) {
    const pangolin = this;
    return bcrypt.compare(password, pangolin.password);
};

pangolinSchema.statics.findByToken = function (token) {
    const pangolin = this;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
        return pangolin.findOne({
            email: decoded.email
        });
    } else {
      return Promise.reject();
    }
  };

export default mongoose.model('Pangolin', pangolinSchema);