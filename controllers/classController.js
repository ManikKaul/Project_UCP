const { Class, Announcement, Discussion, Content } = require('../models/class');

// Now you can use Class, Announcement, Discussion, and Content in your code

const jwt = require('jsonwebtoken');
require('dotenv').config();

function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded || null;
  } catch (error) {
    return null;
  }
}

exports.createClass = async (req, res) => {
  try {
    const { token, name, picture: classPicture } = req.body;
   
    const decodedToken = decodeToken(token);
    console.log(decodedToken,'request')

    if (decodedToken && (decodedToken.type === 'teacher' || decodedToken.type === 'admin')) {
      const participants = [decodedToken.userId];
      const picture = classPicture; // Use a different variable name to avoid conflict
      const newClass = new Class({ name, teacher: decodedToken.username, participants, picture });
      const savedClass = await newClass.save();
      res.status(201).json(savedClass);
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getClasses = async (req, res) => {
  try {
    const { token } = req.body;

    if (token) {
      const decodedToken = decodeToken(token); 
      console.log(decodedToken)
      const userId = decodedToken.userId;
     
      const userClasses = await Class.find({ participants: userId });
      console.log(userClasses,'user Classes')
      res.status(200).json(userClasses);
      
    } else {
      res.status(403).json({ error: 'No token' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Import Announcement model at the top of your file


exports.joinClass = async (req, res) => {
  try {
    const { token, classId } = req.body;

    if (!token || !classId) {
      return res.status(400).json({ error: 'Token and classId are required' });
    }

    const decodedToken = decodeToken(token);

    if (!decodedToken) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const userId = decodedToken.userId;

    // Find the class with the provided classId
    const targetClass = await Class.findById(classId);

    if (!targetClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check if the user is already a participant in the class
    if (targetClass.participants.includes(userId)) {
      return res.status(409).json({ error: 'User is already a participant in the class' });
    }

    // Add the user to the participants list
    targetClass.participants.push(userId);

    // Save the updated class
    await targetClass.save();

    res.status(200).json({ message: 'User successfully joined the class' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getAnnouncements = async (req, res) => {
   console.log(req.body,'body')
  const { classId } = req.body;

  try {
    const announcements = await Announcement.find({ classId: classId });
    console.log(announcements,'announcements')
    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching announcements' });
  }
};

exports.createAnnouncement = async (req, res) => {
  const { classId, content,url, type } = req.body;

  try {
    const newAnnouncement = new Announcement({ classId,url, type, content });
    await newAnnouncement.save();

    res.json({ message: 'Announcement created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating announcement' });
  }
};

exports.createContent = async (req, res) => {
  const { classId, heading, fileName, filePath, token } = req.body;
  const decodedUser = decodeToken(token);

  if (!decodedUser || (decodedUser.type !== 'admin' && decodedUser.type !== 'teacher')) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  try {
    const newClassContent = new Content({ classId, heading, fileName, filePath });
    await newClassContent.save();

    res.json({ message: 'Class content created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating class content' });
  }
};

exports.getContent = async (req, res) => {
  const { classId } = req.body;

  try {
    // Fetch content for the specified classId
    const content = await Content.find({ classId });

    return res.status(200).json(content);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getDiscussions = async(req, res) => {
    try {
      // Extract classId and token from the request body
      const { classId, token } = req.body;
  
      // Decode the token to get user information
      const decodedUser = decodeToken(token);
  
      // Check if the user is authorized
      if (!decodedUser) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
  
      // Fetch discussions for the specified classId
      const discussions = await Discussion.find({
        classId,
        isDeletedBy: { $ne: decodedUser.userId }, // Exclude discussions where the user is in the deletedBy field
      });
  
      res.json(discussions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching discussions' });
    }
  }

  exports.sendDiscussion = async (req, res) => {
    try {
      const { classId, message,token } = req.body;
      const decodedUser = decodeToken(token);
  
      if (!decodedUser) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
  
      try {
        const newDiscussion = new Discussion({ classId, message, sender: decodedUser.userId });
        await newDiscussion.save();
  
        res.json({ message: 'Discussion created successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating Discussion' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching discussions' });
    }
  };
  