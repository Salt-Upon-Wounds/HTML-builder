const fs = require('node:fs');
const path = require('node:path');
const { readdir } = require('node:fs/promises');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

function copydir(from, to) {
  readdir(from, { withFileTypes: true })
    .then((result) => {
      for (const file of result) {
        if (file.isDirectory()) {
          fs.mkdir(path.join(to, file.name), { recursive: true }, (err) => {
            if (err) {
              return console.error(err);
            }
          });
          copydir(path.join(from, file.name), path.join(to, file.name));
        } else {
          fs.copyFile(
            path.join(from, file.name),
            path.join(to, file.name),
            fs.constants.COPYFILE_FICLONE,
            (err) => {
              if (err) {
                console.log('Error Found:', err);
              }
            },
          );
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
copydir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
