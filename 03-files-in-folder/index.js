const fsPromises = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function getDir() {
    const files = await fsPromises.readdir(folderPath,{withFileTypes: true});

    for (const file of files) {
        if (file.isFile()) {
            const filePath = path.join(__dirname, 'secret-folder', file.name);
            const extname = path.extname(file.name).split('.')[1];
            const name = file.name.split('.')[0];
            const stat = await fsPromises.stat(filePath);
            console.log(`${name} - ${extname} - ${stat.size / 1000}kb`);
        } 
    }
}
try {
  getDir();
} catch (err) {
  console.error(err);
}