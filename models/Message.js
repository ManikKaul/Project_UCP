const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming there's a User model
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    deletedBy: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
