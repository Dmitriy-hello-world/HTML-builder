const fsPromises = require('fs/promises');
const path = require('path');

fsPromises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true});

async function copyDir() {
    const files = await fsPromises.readdir(path.join(__dirname,'files'),{withFileTypes: true});

    for (const file of files) {
        if (file.isFile()) {
            fsPromises.copyFile( path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name));
        } else {
            fsPromises.mkdir(path.join(__dirname, 'files-copy' ,file.name), {recursive: true});
        }
    }
}
try {
  copyDir();
} catch (err) {
  console.error(err);
}