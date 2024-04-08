const File = require('../models/File');

// Example of uploading a file
exports.uploadFile = async (req, res) => {
  try {
    const { filename, path, uploaderId } = req.body;

    const newFile = new File({
      filename,
      path,
      uploader: uploaderId,
    });

    await newFile.save();

    res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Example of getting all files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
