const fsPromises = require('fs/promises');
const path = require('path');

async function reloadDir() {
  await fsPromises.rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true }, (err) => {
    if (err) {
      throw err;
    }    
  });

  await fsPromises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true} , (error) => {
    if (error) {
      throw error;
    }
  });

  await copyDir();
}

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
  reloadDir();
} catch (err) {
  console.error(err);
}