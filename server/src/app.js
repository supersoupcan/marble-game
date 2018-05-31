const express = require('express');

const path = require('path');

var app = express();

app.use(express.static(path.resolve(__dirname, '..', '..', 'client', 'static')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'static', 'index.html'));
});

module.exports = app;