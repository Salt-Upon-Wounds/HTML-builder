const fs = require('node:fs');
const path = require('node:path');
const pr = require('node:fs/promises');

function copydir(from, to) {
  pr.readdir(from, { withFileTypes: true })
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

pr.access(path.join(__dirname, 'files-copy'), fs.constants.W_OK)
  .then(() => {
    return pr.rm(path.join(__dirname, 'files-copy'), { recursive: true });
  })
  .catch(() => {})
  .finally(() => {
    pr.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }).then(
      () => {
        copydir(
          path.join(__dirname, 'files'),
          path.join(__dirname, 'files-copy'),
        );
      },
    );
  });
