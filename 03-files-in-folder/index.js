const fs = require('node:fs');
const path = require('node:path');
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
          let ext = path.extname(file);
          if (ext && ext[0] === '.') ext = ext.slice(1, ext.length);
          console.log(path.parse(file).name, '-', ext, '-', stats.size);
        }
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
