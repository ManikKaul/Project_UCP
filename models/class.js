const mongoose = require('mongoose');
const { Schema } = mongoose;

const announcementSchema = new Schema({
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video'],
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  url: String,
  content: String,

  // Additional fields based on announcement type (e.g., image, video URL)
});

const discussionSchema = new Schema({
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  // Add a flag to indicate whether the message is deleted
  isDeletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    
  },
});

const contentSchema = new Schema({
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  // Additional fields related to content (e.g., subject, description)
});

const classSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  picture: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/128/2922/2922510.png', // Provide a default image URL if needed
  },
});

const Class = mongoose.model('Class', classSchema);

module.exports = {
  Class,
  Announcement: mongoose.model('Announcement', announcementSchema),
  Discussion: mongoose.model('Discussion', discussionSchema),
  Content: mongoose.model('Content', contentSchema),
};
