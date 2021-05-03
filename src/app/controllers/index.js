const fs = require('fs');
const path = require('path');

// exporta todos arquivos da pasta controllers com exceção do index.js
module.exports = app => {
  fs
    .readdirSync(_dirname)
    .filter(file => ((file.indexOf('.')) !== 0 && (file !== 'index.js')))
    .forEach(file => require(path.resolve(__dirname, file)(app)));
}