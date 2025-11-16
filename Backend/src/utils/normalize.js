// src/utils/normalize.js

function normalizeTrelloEvent(payload) {
  const action = payload?.action || {};
  const data = action.data || {};
  const boardId = data.board?.id;
  const cardId = data.card?.id;
  const type = action.type || 'trello_event';

  // Trello includes "old" fields on updates
  const changes = data.old ? Object.fromEntries(Object.entries(data.old).map(([k, oldVal]) => {
    const newVal = (data.card && data.card[k] !== undefined) ? data.card[k] : undefined;
    return [k, { old: oldVal, new: newVal }];
  })) : undefined;

  // Map common actions to a simpler set
  let mappedType = type;
  if (type.includes('updateCard')) mappedType = 'card_updated';
  if (type.includes('createCard')) mappedType = 'card_created';
  if (type.includes('moveCard')) mappedType = 'card_moved';
  if (type.includes('deleteCard') || type.includes('archiveCard')) mappedType = 'card_deleted';

  return {
    type: mappedType,
    boardId,
    cardId,
    changes,
    raw: payload
  };
}

module.exports = { normalizeTrelloEvent };
