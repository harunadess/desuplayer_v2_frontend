const express = require('express');
const path = require('path');
const { networkInterfaces } = require('os');

const app = express();
const port = 8080;

const interfaces = networkInterfaces();
// todo: make this not shit, and actually find the first "active" one
const defaultInterface = interfaces['en0'].filter(eth => eth.family === 'IPv4')[0];

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

console.log(`${new Date()} serving content to:`);
app.listen(port, () => {
  console.log(`  -> http://localhost:${port}\t(locally)`);
});
app.listen(port, defaultInterface.address, () => {
  console.log(`  -> http://${defaultInterface.address}:${port}\t(on local network)`);
});
