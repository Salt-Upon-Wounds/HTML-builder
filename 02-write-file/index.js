const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const file = path.join(__dirname, 'text.txt');

const stream = fs.createWriteStream(file);

console.log('Enter text:');
process.stdin.on('data', (data) => {
  if (data.toString().trim() == 'exit') {
    process.exit();
  }
  stream.write(data);
  console.log('Enter text:');
});

process.stdin.resume();

process.on('SIGINT', () => {
  process.exit();
});
