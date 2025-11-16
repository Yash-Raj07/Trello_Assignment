// src/routes/tasks.js
const express = require('express');
const router = express.Router();
const trello = require('../services/trelloClient');

// POST /api/tasks -> create Trello card (POST /1/cards)
router.post('/', async (req, res, next) => {
  try {
    const { listId, boardId, name, desc } = req.body;
    if (!listId || !name) {
      return res.status(400).json({ success: false, error: 'listId and name are required' });
    }

    const payload = {
      name,
      desc: desc || '',
      idList: listId,
      idBoard: boardId,
      // you can include more fields here if needed
    };

    const card = await trello.post('/cards', { params: payload });

    const event = { type: 'card_created', payload: card };

    // emit via socket.io
    const io = req.app.get('io');
    if (io) io.emit('trello_event', event);

    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:cardId -> update card (PUT /1/cards/{id})
// Supports moving lists by sending idList in body
router.put('/:cardId', async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const allowed = ['name', 'desc', 'idList', 'closed', 'due', 'dueComplete'];
    const updates = {};
    for (const k of allowed) {
      if (k in req.body) updates[k] = req.body[k];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields to update' });
    }

    const updated = await trello.put(`/cards/${cardId}`, { params: updates });

    const event = { type: 'card_updated', payload: updated };
    const io = req.app.get('io');
    if (io) io.emit('trello_event', event);

    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:cardId -> close card (PUT with closed=true)
// NOTE: using PUT closed=true instead of hard delete. See note below.
router.delete('/:cardId', async (req, res, next) => {
  try {
    const { cardId } = req.params;

    // We set closed=true (archive) rather than calling DELETE. This preserves history
    // and is the safer, recommended pattern for Trello. If you prefer hard delete,
    // you can call DELETE /1/cards/{id}.
    const result = await trello.put(`/cards/${cardId}`, { params: { closed: true } });

    const event = { type: 'card_deleted', payload: result };
    const io = req.app.get('io');
    if (io) io.emit('trello_event', event);

    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
