import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let friendsSchema = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: 'Pangolin'},
    recipient: { type: Schema.Types.ObjectId, ref: 'Pangolin'},
    status: {
        type: Number,
        enums: [
            0,    //'add friend',
            1,    //'requested',
            2,    //'pending',
            3,    //'friends'
        ]
    }
}, {
    collection: 'friends'
});

export default mongoose.model('Friend', friendsSchema);