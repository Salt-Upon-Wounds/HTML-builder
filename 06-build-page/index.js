const fs = require('node:fs');
const path = require('node:path');
const pr = require('node:fs/promises');
const readline = require('readline');

function cp() {
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

  pr.access(path.join(__dirname, 'project-dist', 'assets'), fs.constants.W_OK)
    .then(() => {
      return pr.rm(path.join(__dirname, 'project-dist', 'assets'), {
        recursive: true,
      });
    })
    .catch(() => {})
    .finally(() => {
      pr.mkdir(path.join(__dirname, 'project-dist', 'assets'), {
        recursive: true,
      }).then(() => {
        copydir(
          path.join(__dirname, 'assets'),
          path.join(__dirname, 'project-dist', 'assets'),
        );
      });
    });
}

function merge() {
  const dir = path.join(__dirname, 'styles');
  const dest = path.join(__dirname, 'project-dist', 'style.css');

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
}

function htmlbuilder() {
  const templatePath = path.join(__dirname, 'template.html');
  const resultPath = path.join(__dirname, 'project-dist', 'index.html');
  const componentPath = path.join(__dirname, 'components');
  const ws = fs.createWriteStream(resultPath);
  const reg = /{{[^{}]{1,}}}/g;

  (async () => {
    const rl = readline.createInterface({
      input: fs.createReadStream(templatePath),
      crlfDelay: Infinity,
    });

    for await (let line of rl) {
      const tmp = line.match(reg);
      if (tmp) {
        for (const key of tmp) {
          const data = await pr.readFile(
            path.join(
              componentPath,
              key.replace(/{{/g, '').replace(/}}/g, '').concat('.html'),
            ),
          );
          if (data) line = line.replace(key, data.toString().trim());
        }
      }
      ws.write(line.concat('\n'));
    }
  })();
}

fs.mkdir(
  path.join(__dirname, 'project-dist'),
  { recursive: true },
  function (err) {
    console.log(err);
    return 0;
  },
);

cp();
merge();
htmlbuilder();
