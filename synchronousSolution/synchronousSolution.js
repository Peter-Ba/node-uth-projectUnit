const fs = require('fs');
const readFile = './readFile.txt';
const writeFile1 = './synchronousSolution/writeFile1.txt';
const writeFile2 = './synchronousSolution/writeFile2.txt';
const writeFile3 = './synchronousSolution/writeFile3.txt';
const writeFile4 = './synchronousSolution/writeFile4.txt';
const writeFile5 = './synchronousSolution/writeFile5.txt';


fs.readFile(readFile, (err, data) => {
  if(err) throw err;
  const lorem = data.toString();
  const aLorem = lorem.replace(/a/gim, 'e');
  const eLorem = lorem.replace(/e/gim, 'i');
  const iLorem = lorem.replace(/i/gim, 'o');
  const oLorem = lorem.replace(/o/gim, 'u');
  const uLorem = lorem.replace(/u/gim, 'a');

  fs.writeFileSync(writeFile1, aLorem, (err, data) => {
    if(err) throw err;
    console.log('a to e Complete!')
  })

  fs.writeFileSync(writeFile2, eLorem, (err, data) => {
    if(err) throw err;
    console.log('e to i Complete!')
  })

  fs.writeFileSync(writeFile3, iLorem, (err, data) => {
    if(err) throw err;
    console.log('i to o Complete!')
  })

  fs.writeFileSync(writeFile4, oLorem, (err, data) => {
    if(err) throw err;
    console.log('u to a Complete!')
  })

  fs.writeFileSync(writeFile5, uLorem, (err, data) => {
    if(err) throw err;
    console.log('a to e Complete!')
  })
})

