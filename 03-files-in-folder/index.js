const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const { readdir } = require('node:fs/promises');

const file = path.join(__dirname, 'secret-folder');

readdir(file)
  .then((result) => {
    for (const file of result) {
      fs.stat(path.join(__dirname, 'secret-folder', file), (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stats.isFile()) {
          console.log(
            path.parse(file).name,
            '-',
            path.extname(file),
            '-',
            stats.size,
          );
        }
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
