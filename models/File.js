const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uploader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
