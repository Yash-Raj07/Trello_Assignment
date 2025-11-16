// src/services/trelloClient.js
const axios = require('axios');

const BASE = process.env.TRELLO_API_BASE || 'https://api.trello.com/1';
const KEY = process.env.TRELLO_KEY;
const TOKEN = process.env.TRELLO_TOKEN;

// Helper to append key & token to all requests
function buildUrl(path) {
  const sep = path.includes('?') ? '&' : '?';
  return `${BASE}${path}${sep}key=${KEY}&token=${TOKEN}`;
}

// Axios wrapper
async function get(path, options = {}) {
  const url = buildUrl(path);
  const res = await axios.get(url, options);
  return res.data;
}

async function post(path, data = {}) {
  const url = buildUrl(path);
  const res = await axios.post(url, data);
  return res.data;
}

async function put(path, data = {}) {
  const url = buildUrl(path);
  const res = await axios.put(url, data);
  return res.data;
}

async function del(path) {
  const url = buildUrl(path);
  const res = await axios.delete(url);
  return res.data;
}

module.exports = { get, post, put, del };
