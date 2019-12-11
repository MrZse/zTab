const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/',
  output: {
    path: path.resolve(__dirname,'dist'),
    filename: "tab.bundle.js"
  }
};
