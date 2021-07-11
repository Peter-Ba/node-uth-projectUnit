const fs = require('fs');
const { Transform, pipeline } = require('stream');
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

const handleError = (err) => {
  if (err) {
    throw err;
  }
};

const inputFilepath = './large.txt';
const outputFilepaths = [
  './synchronousSolution/a_to_e.txt',
  './synchronousSolution/e_to_i.txt',
  './synchronousSolution/i_to_o.txt',
  './synchronousSolution/o_to_u.txt',
  './synchronousSolution/u_to_a.txt',
];

const inputStream = fs.createReadStream(inputFilepath);

const replaceTransformStreams = [
  new Replace({ searchValue: /a/gim, replaceValue: 'e' }),
  new Replace({ searchValue: /e/gim, replaceValue: 'i' }),
  new Replace({ searchValue: /i/gim, replaceValue: 'o' }),
  new Replace({ searchValue: /o/gim, replaceValue: 'u' }),
  new Replace({ searchValue: /u/gim, replaceValue: 'a' }),
];

for (let i = 0; i < replaceTransformStreams.length; i += 1) {
  const currentTransform = replaceTransformStreams[i];
  const currentOutputFilepath = outputFilepaths[i];
  const currentOutputStream = fs.createWriteStream(currentOutputFilepath);

  pipeline(inputStream, currentTransform, currentOutputStream, handleError);
}
