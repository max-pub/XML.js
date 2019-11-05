let FS = require('fs');
let Terser = require("terser");

let src = FS.readFileSync('./src/xml.js','utf-8');

FS.writeFileSync('./dist/web.min.js','window.'+Terser.minify(src).code);
FS.writeFileSync('./dist/cjs.js',`var DOMParser = require('xmldom').DOMParser;var XMLSerializer = require('xmldom').XMLSerializer;` + src + `module.exports.XML = XML;`);

