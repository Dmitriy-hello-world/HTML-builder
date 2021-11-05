const fs = require('fs');
const path = require('path');
const process = require('process');

const { stdin, stdout } = process;
let output = null;

stdout.write('Привететствую Вас, введите данные, которые необходимо записать в файл\n...\n');
stdin.on('data', chank => {
    if (!output) {
        output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
    }
    if (chank.toString().trim() === 'exit') {
        stdout.write('NodeJS заевршил свою работу, Удачи!');
        process.exit();
    }
    output.write(chank);
});
process.on('SIGINT', () => {
    stdout.write('NodeJS заевршил свою работу, Удачи!');
    process.exit();
});