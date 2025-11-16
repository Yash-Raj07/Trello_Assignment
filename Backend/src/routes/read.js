const express = require('express');
const router = express.Router();
const trello = require('../services/trelloClient');

// GET /api/boards/:boardId/full
router.get('/boards/:boardId/full', async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const board = await trello.get(`/boards/${boardId}`);
    const lists = await trello.get(`/boards/${boardId}/lists`);
    const cards = await trello.get(`/boards/${boardId}/cards`);

    res.json({ success: true, data: { board, lists, cards } });
  } catch (err) {
    console.error('Trello API error:', err.response?.data || err.message);
    next(err);
  }
});

module.exports = router;
