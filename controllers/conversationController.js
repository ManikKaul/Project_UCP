const Conversation = require('../models/Conversations');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded || null;
  } catch (error) {
    return null;
  }
}

// Assuming you have the necessary models (User, Conver
exports.createConversation = async (req, res) => {
    try {
        const { type, participants, admin, groupPic, groupName } = req.body;

        if (!type || !participants || (type === 'private' && participants.length !== 2)) {
            return res.status(400).json({ error: 'Invalid conversation input' });
        }

        const existingConversation = await Conversation.findOne({
            type: type,
            participants: { $all: participants },
        });

        if (existingConversation) {
            return res.status(400).json({ error: 'Conversation already exists for these participants' });
        }

        const conversation = new Conversation({
            type,
            participants,
            admin,
            groupPic,
            groupName,
        });

        const savedConversation = await conversation.save();
        return res.status(201).json(savedConversation);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getConversations = async (req, res) => {
    try {
      const { token } = req.body;
      const decodedToken = decodeToken(token);
  
      // Fetch conversations where the user is a participant
      const conversations = await Conversation.find({
        'participants.userId': decodedToken.userId,
      }).populate('participants.userId', 'username  dp'); // Add the fields you want to retrieve from the user document
  
      return res.status(200).json({ conversations });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  

  // Controller function to get messages for a conversation
 // Import your Message model

  exports.getMessages = async (req, res) => {
    try {
      const { conversationId, token } = req.body;
      const decodedToken = decodeToken(token);
  
      // Fetch messages for the specified conversation and populate the 'userId' field
      const messages = await Message.find({ conversationId })
        .populate('sender', 'username');
  
      // Filter out messages where userId is in deletedBy
      const filteredMessages = messages.filter(message => !message.deletedBy || !message.deletedBy.includes(decodedToken.userId));
  console.log(filteredMessages,'filtereeeeeeeeeeeeeeeeee')
      return res.status(200).json({ messages: filteredMessages });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  


exports.saveMessages = async (req, res) => {
  try {
    const { conversationId, sender,  text } = req.body;

    // Create a new message
    const newMessage = new Message({
      conversationId,
      sender,
      text,
    });

    // Save the message to the database
    const savedMessage = await newMessage.save();

    return res.status(201).json({ message: savedMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};