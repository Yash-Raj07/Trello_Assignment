// src/routes/boards.js
const express = require('express');
const router = express.Router();
const trello = require('../services/trelloClient');

// POST /api/boards -> create board (POST /1/boards)
router.post('/', async (req, res, next) => {
  try {
    const { name, defaultLists = true, desc } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'name is required' });

    // Trello expects 'defaultLists' as boolean, but as query param it will be string
    const params = { name, defaultLists, desc };
    const board = await trello.post('/boards', { params });

    const event = { type: 'board_created', payload: board };
    const io = req.app.get('io');
    if (io) io.emit('trello_event', event);

    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
