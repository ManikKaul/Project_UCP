const express = require('express');
const http = require('http'); // Import the HTTP module
const cors = require('cors');
const db = require('./db');
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');
const User = require('./models/userModel');

const handleSockets = require('./socketHandler');

const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const bodyParser = require('body-parser');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.json());
// app.use(authenticateToken);


const httpServer = http.createServer(app); // Create an HTTP server


const io = socketIO(httpServer, {
  cors: {
      origin: "*", // Allow all origins
      methods: ["GET", "POST"]
  }
});





handleSockets(io);
const PORT_HTTP = process.env.PORT_HTTP|| 80;

// app.use('/class', channelRoutes);
app.use('/', authRoutes);
app.use('/class', classRoutes);
app.use('/chat', conversationRoutes);

// app.use('/chat', conversationRoutes);

app.post('/api/searchUsers', async (req, res) => {
  try {
    const { username } = req.body;
    const sortedUsers = await searchUsers(username);
    res.json(sortedUsers);
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const searchUsers = async (username) => {
  try {
    const users = await User.find({ username: { $regex: new RegExp(username, 'i') } });
    return users;
  } catch (error) {
    console.error('Error searching for users:', error);
    throw error; //
  }
};

httpServer.listen(PORT_HTTP, () => {
    console.log(`HTTP Server is running on port ${PORT_HTTP}`);
});

