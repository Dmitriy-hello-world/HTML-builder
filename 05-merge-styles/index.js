const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'styles');
const bundle = fs.createWriteStream(path.join(__dirname, 'project-dist' , 'bundle.css'));

async function createBundle() {
    const files = await fsPromises.readdir(folderPath,{withFileTypes: true});
    files.forEach( async (file) => {
        if (file.isFile()) {
            if (path.extname(file.name).split('.')[1] === 'css') {
                let readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), "utf8");
                readableStream.on("data", function(chunk){
                    bundle.write(chunk.toString() + '\n');
                });
            }
        } 
    });
}
try {
  createBundle();
} catch (err) {
  console.error(err);
}