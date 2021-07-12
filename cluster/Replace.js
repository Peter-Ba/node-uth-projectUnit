const { Transform } = require('stream');
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

module.exports = Replace;
