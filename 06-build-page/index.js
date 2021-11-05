const fsPromises = require('fs/promises');
const path = require('path');
const fs = require('fs');

fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
const style = fs.createWriteStream(path.join(__dirname, 'project-dist' , 'style.css'));
fsPromises.mkdir(path.join(__dirname, 'project-dist' , 'assets'), {recursive: true});

async function getHtml() {
  const template = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const indexHTML = fs.createWriteStream(path.join(__dirname, 'project-dist' , 'index.html'));
  let resultHTML = '';
   
  template.on("data", chunk => {
    resultHTML = chunk.toString();
    fs.readdir(path.join(__dirname,'components'),{withFileTypes: true}, (err,data) => {
    if (err) {
      throw err;
    }
    let tempArr = [];
    data.forEach(file => {
      tempArr.push(`{{${file.name.split('.')[0]}}}`);
    });
    fsPromises.readdir(path.join(__dirname, 'components'))
    .then( async files => {
      files.forEach( (file,i) => {
        const readableStream = fs.createReadStream(path.join(__dirname, 'components', file), 'utf-8');
        readableStream.on('data', chunk => {
          resultHTML = resultHTML.replace(tempArr[i], chunk);
          if (i === tempArr.length - 1) {
            indexHTML.write(resultHTML);
          }
        });
      });
    });
    });
  });
}

async function createBundleCss() {
  const files = await fsPromises.readdir(path.join(__dirname,'styles'),{withFileTypes: true});
  files.forEach( async (file) => {
      if (file.isFile()) {
          if (path.extname(file.name).split('.')[1] === 'css') {
              let readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), "utf8");
              readableStream.on("data", function(chunk){
                  style.write(chunk.toString() + '\n');
              });
          }
      } 
  });
}

async function copyAssets() {
  const files = await fsPromises.readdir(path.join(__dirname,'assets'),{withFileTypes: true});

  for (const file of files) {
      if (file.isFile()) {
          fsPromises.copyFile( path.join(__dirname, 'assets', file.name), path.join(__dirname, 'project-dist' , 'assets', file.name));
      } else {
          fsPromises.mkdir(path.join(__dirname, 'project-dist' , 'assets' ,file.name), {recursive: true});
          const folder = await fsPromises.readdir(path.join(__dirname, 'assets' , file.name),{withFileTypes: true});

          for (const deepFile of folder) {
            if (deepFile.isFile()) {
                fsPromises.copyFile( path.join(__dirname, 'assets', file.name ,deepFile.name), path.join(__dirname, 'project-dist' , 'assets', file.name , deepFile.name));
            }
        }
      }
  }
}

try {
    getHtml();
    createBundleCss();
    copyAssets();
} catch (err) {
  console.error(err);
}