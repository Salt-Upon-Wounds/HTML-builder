const fs = require('node:fs');
const path = require('node:path');

const dir = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(dir, (err, files) => {
  if (err) {
    console.error(err);
    return 0;
  }

  fs.writeFile(dest, '', (err) => {
    if (err) {
      console.log(err);
      return 0;
    }
  });

  for (let file of files) {
    if (path.extname(file) === '.css') {
      fs.readFile(path.join(dir, file), (err, data) => {
        if (err) {
          console.log(err);
          return 0;
        }
        fs.appendFile(dest, data, (err) => {
          if (err) {
            console.log(err);
            return 0;
          }
        });
      });
    }
  }
});
