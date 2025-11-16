// src/state/events.js
// State shape:
// { board: {...}, lists: [{id, name}], cards: [{id, idList, name, ...}] }

export function applyEvent(state, event) {
  const s = { ...state, lists: [...(state.lists||[])], cards: [...(state.cards||[])] };

  switch (event.type) {
    case 'board_snapshot': {
      // optional fallback polling snapshot
      return { ...s, cards: event.raw };
    }
    case 'card_created': {
      const card = event.raw?.action?.data?.card || event.payload || event.raw;
      if (!card || !card.id) return s;
      if (!s.cards.find(c => c.id === card.id)) s.cards.push(card);
      return s;
    }
    case 'card_updated':
    case 'card_moved': {
      const updated = event.raw?.action?.data?.card || event.payload || event.raw;
      if (!updated || !updated.id) return s;
      const idx = s.cards.findIndex(c => c.id === updated.id);
      if (idx >= 0) {
        s.cards[idx] = { ...s.cards[idx], ...updated };
      } else {
        s.cards.push(updated);
      }
      return s;
    }
    case 'card_deleted': {
      const deleted = event.raw?.action?.data?.card || event.payload || event.raw;
      if (!deleted || !deleted.id) return s;
      return { ...s, cards: s.cards.filter(c => c.id !== deleted.id && c.closed !== true) };
    }
    default:
      return s;
  }
}
