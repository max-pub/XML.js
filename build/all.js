let FS = require('fs');
let Terser = require("terser");

let base = FS.readFileSync('./src/base.js', 'utf-8');
let nice = FS.readFileSync('./src/nice.js', 'utf-8');

FS.writeFileSync('./dist/base.min.js', 'window.' + Terser.minify(base).code);
FS.writeFileSync('./dist/nice.min.js', 'window.' + Terser.minify(nice).code.replace('...XML', '...window.XML'));
FS.writeFileSync('./dist/full.min.js', FS.readFileSync('./dist/base.min.js', 'utf-8') + FS.readFileSync('./dist/nice.min.js', 'utf-8'));
FS.writeFileSync('./dist/common.js', `var DOMParser = require('xmldom').DOMParser;var XMLSerializer = require('xmldom').XMLSerializer;` + base + nice + `module.exports.XML = XML;`);

