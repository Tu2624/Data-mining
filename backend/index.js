const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Logger middleware để track request
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Database connection pool
const pool = require('./config/db');

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('join_room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// App-wide instance of IO
app.set('io', io);

// Routes
const apiRoutes = require('./routes/api.routes');
app.use('/api', apiRoutes);

// Test connection route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'FoodRec AI API is running with Real-time support' });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, pool, io };
