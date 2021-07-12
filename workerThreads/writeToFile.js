const { workerData, parentPort } = require('worker_threads')
const { Transform, pipeline } = require('stream')
const fs = require('fs');

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

const { readFileName, writeFileName, transformOption } = workerData;

const readStream = fs.createReadStream(readFileName);
const writeStream = fs.createWriteStream(writeFileName);
const transformStream = new Replace(transformOption);

pipeline(readStream, transformStream, writeStream, (err) => {
  if (err) {
    console.error(err);
  } else {
    parentPort.postMessage({ message: `completed writing to ${writeFileName}` })  
  }
});
