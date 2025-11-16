// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');

const tasksRouter = require('./src/routes/tasks');
const boardsRouter = require('./src/routes/boards');
const webhooksRouter = require('./src/routes/webhooks');
const readRouter = require('./src/routes/read');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/tasks', tasksRouter);
app.use('/api/boards', boardsRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api', readRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));

io.on('connection', (socket) => {
  console.log('client connected', socket.id);
  socket.on('join_board', ({ boardId }) => {
    if (!boardId) return;
    socket.join(`board:${boardId}`);
    console.log(`socket ${socket.id} joined room board:${boardId}`);
  });
  socket.on('disconnect', () => console.log('client disconnected', socket.id));
});
