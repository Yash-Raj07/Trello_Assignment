// src/routes/webhooks.js
const express = require('express');
const router = express.Router();
const { normalizeTrelloEvent } = require('../utils/normalize');

// Trello validates with a HEAD request on creation.
// Respond 200 to HEAD. For POST, emit normalized events.
router.all('/trello', (req, res) => {
  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  // Trello sends JSON body on POST
  const event = normalizeTrelloEvent(req.body);

  // Broadcast to the board room if we have boardId, else global
  const io = req.app.get('io');
  if (io) {
    if (event.boardId) {
      io.to(`board:${event.boardId}`).emit('trello_event', event);
    } else {
      io.emit('trello_event', event);
    }
  }

  // Always 200 quickly
  return res.json({ success: true, event });
});

module.exports = router;
