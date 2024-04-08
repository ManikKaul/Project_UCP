const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Unauthorized: Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, type: user.type },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );
    console.log('jwt',token);
    res.status(200).json({ token});
  } catch (error) {
    res.status(500).json({ message: 'A server error occurred' });
  }
};

exports.signup = async (req, res) => {
    const { firstName, lastName, username,department,semester, email, password, type } = req.body;
    console.log('bbbbbbbbb',req.body.type)
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res
          .status(400)
          .json({ message: 'Bad Request: Username or email already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const newUser = new User({
        firstName,
        lastName,
        username,
        department,
        semester,
        email,
        password: hashedPassword,
        type: type || 'student', // Set the default type to 'student' if not provided
      });
  
      await newUser.save();
  
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
  
      const token = jwt.sign(
        { userId: user._id, username: username, type: type  },
        process.env.JWT_SECRET,
        {
          expiresIn: '30d',
        }
      );
  
      res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'A server error occurred' });
    }
  };

exports.userData = async (req, res) => {
  const token = req.body.token; // Assuming the token is sent in the request body

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decodedUsername = decoded.username;

    const user = await User.findOne({ username: decodedUsername });

    if (user) {
      return res.status(200).json({ valid: true, user });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};