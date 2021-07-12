const fs = require('fs');
const {
  Transform,
  pipeline
} = require('stream');




class Replace extends Transform {
  constructor(options) {
    super(options);

    this.options = options;
  }

  _transform(chunk, encoding, callback) {
    try {
      const text = chunk
        .toString()
        .replace(this.options.searchValue, this.options.replaceValue);

      callback(null, text);
    } catch (err) {
      callback(err);
    }
  }
}

process.on('message', ({
  currentTransformStream,
  currentFile
}) => {
  try {
    const inputFilepath = './data/large.txt';
    const readFile = fs.createReadStream(inputFilepath, 'utf-8');
    const writeFile = fs.createWriteStream(currentFile, 'utf-8');

    const transform = new Replace(currentTransformStream);;
    readFile.pipe(transform).pipe(writeFile);

    pipeline(readFile, transform, writeFile, (err) => {
      if (err) console.log(`error with pipeline function inside childProcess file: ${err}`);
      process.send(`completed writing to: ${writeFile}`)
      process.exit();
    });
  } catch (err) {
    console.log('err');
    process.exit();
  }
})