const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

console.log(`${new Date()} serving content to:`);
app.listen(port, () => {
  console.log(`  -> http://localhost:${port}\t(locally)`);
});
