const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
    type: {
        type: String,
        enum: ['private', 'group'],
        required: true,
    },
    participants: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        }
    ],
    admin:{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    groupPic: {
        type: String,
        default: "default-group-pic.jpg"
    },
    groupName: {
        type: String
    }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
