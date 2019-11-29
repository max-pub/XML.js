
import * as FS from 'fs';
import Terser from 'terser';


let base = FS.readFileSync('./src/base.js', 'utf-8');
let nice = FS.readFileSync('./src/nice.js', 'utf-8');
let nodeOnly = FS.readFileSync('./src/node.js', 'utf-8');
let nodeImports = FS.readFileSync('./src/nodeImports.js', 'utf-8');

FS.writeFileSync('./dist/base.js',  Terser.minify(base).code);
FS.writeFileSync('./dist/nice.js',  Terser.minify(nice).code);
// FS.writeFileSync('./dist/full.min.js', FS.readFileSync('./dist/base.min.js', 'utf-8') + FS.readFileSync('./dist/nice.min.js', 'utf-8'));


// let nodeImports = `import XMLDOM from 'xmldom-ts'; let {DOMParser,XMLSerializer} = XMLDOM;\n import xsltProcessor from 'xslt-processor'; let XSLTProcessor = xsltProcessor.xsltProcess; \n import * as FS from 'fs'\n`;
FS.writeFileSync('./dist/node.js', nodeImports + base.split('\n').slice(0,-1).join('\n') + nodeOnly + nice.split('\n').slice(3).join('\n'));

