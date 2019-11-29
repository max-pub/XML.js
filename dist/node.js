// import { DOMImplementationImpl, DOMParserImpl, XMLSerializerImpl } from 'xmldom-ts';
// import { install, XSLTProcessor } from 'xslt-ts';


import XMLDOM from 'xmldom-ts'; 
let DOMParser = XMLDOM.DOMParserImpl;
let XMLSerializer = XMLDOM.XMLSerializerImpl;

import XSLT from 'xslt-ts'; 
let XSLTProcessor = XSLT.XSLTProcessor; 


import * as FS from 'fs';

// console.log(XMLDOM);

XSLT.install(new XMLDOM.DOMParserImpl(), new XMLDOM.XMLSerializerImpl(), new XMLDOM.DOMImplementationImpl());

export default class XML {
    static parse(string, type = 'text/xml') { // like JSON.parse
        return new DOMParser().parseFromString(string, type)
    }
    static stringify(DOM) { // like JSON.stringify
        return new XMLSerializer().serializeToString(DOM)
    }
     static async fetch(url) {
        return XML.parse(await fetch(url).then(x => x.text()))
    }
    static tag(tagName, attributes){
        let tag = XML.parse(`<${tagName}/>`);
        for(let key in attributes) tag.firstChild.setAttribute(key,attributes[key]);
        return tag.firstChild;
    }
    static transform(xml, xsl, stringOutput = true) {
        // console.log('proc',XSLTProcessor);
        let processor = new XSLTProcessor();
        processor.importStylesheet(typeof xsl == 'string' ? XML.parse(xsl) : xsl);
        // if(typeof document == 'undefined') let document = null;
        // let output = processor.transformToFragment(typeof xml == 'string' ? XML.parse(xml) : xml, typeof document == 'undefined' ? null : document);
        let output = processor.transformToDocument(typeof xml == 'string' ? XML.parse(xml) : xml);
        return stringOutput ? XML.stringify(output) : output;
        // return typeof xml == 'string' ? XML.stringify(output) : output; // if source was string then stringify response, else return object
    }
    static load(path, encoding){
        return XML.parse(FS.readFileSync(path, encoding || 'utf-8'));
    }

    static save(path, content){
        FS.writeFileSync(path, typeof content == 'string' ? content : XML.stringify(content));
    }
    static minify(node) {
        return XML.toString(node)
    }
    static prettify(node) {
        return XML.toString(node, { prettify: true })
    }
    static highlight(node) {
        return XML.toString(node, { prettify: true, highlight: true })
    }
    
    static escape(string){
        // remove everything forbidden by XML 1.0 specifications, plus the unicode replacement character U+FFFD
        let invalidCharacters1 = /([^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFC\u{10000}-\u{10FFFF}])/ug;
        // remove everything not suggested by XML 1.0 specifications
        let invalidCharacters2 = /([\x7F-\x84]|[\x86-\x9F]|[\uFDD0-\uFDEF]|[\u{1FFFE}-\u{1FFFF}]|[\u{2FFFE}-\u{2FFFF}]|[\u{3FFFE}-\u{3FFFF}]|[\u{4FFFE}-\u{4FFFF}]|[\u{5FFFE}-\u{5FFFF}]|[\u{6FFFE}-\u{6FFFF}]|[\u{7FFFE}-\u{7FFFF}]|[\u{8FFFE}-\u{8FFFF}]|[\u{9FFFE}-\u{9FFFF}]|[\u{AFFFE}-\u{AFFFF}]|[\u{BFFFE}-\u{BFFFF}]|[\u{CFFFE}-\u{CFFFF}]|[\u{DFFFE}-\u{DFFFF}]|[\u{EFFFE}-\u{EFFFF}]|[\u{FFFFE}-\u{FFFFF}]|[\u{10FFFE}-\u{10FFFF}].)/ug;
        return string.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(invalidCharacters1, '').replace(invalidCharacters2, '');
    }


    static toString(node, options, level = 0) {
        // if(!node) return;
        options = { ...{ prettify: false, highlight: false, escapeValues: true, skipEmptyAttributes: true, skipEmptyNodes: true, inlineTags: ['b', 'i', 'u', 'q'] }, ...options };
        if (typeof node == 'string') node = XML.parse(node);
        let tabs = options.prettify ? Array(level + 1).fill('').join('\t') : '';
        let newLine = options.prettify ? '\n' : '';
        let lt = options.highlight ? '&lt;' : '<';
        let gt = options.highlight ? '&gt;' : '>';
        // let tag = (name, close) => (options.highlight ? '<' + (close ? '/' : '') + name + '>' : '');
        let tag = (name, value, _class = '') => (options.highlight ? `<${name} ${_class ? `class='${_class}'` : ''}>${escapeValue(value)}</${name}>` : value);
        let escapeValue = value => options.escapeValues ? this.escape(value) : value;
        let valueType = value => {
            if (['null', 'undefined', 'NaN', 'true', 'false'].includes(value)) return value;
            // if (value == 'null') return 'null';
            // if (value == 'undefined') return 'undefined';
            // if (value == 'NaN') return 'NaN';
            // if (value == 'true') return 'boolean true';
            // if (value == 'false') return 'boolean false';
            if (value * 1 == value) return 'number';
            let date = new Date(value);
            if (date.getFullYear() > 1900 && date.getFullYear() < 2100) return 'date';
            if (date.getFullYear() > 1000 && date.getFullYear() < 5000) return 'far-date';
            return '';
        }
        if (node.nodeType == 3 && !node.textContent.trim()) return ''; // if textContent is only linebreaks or spaces, return nothing
        if (node.nodeType == 3) return tabs + tag('content', node.textContent.trim()) + newLine;
        if (!node.tagName) { // only relevant for the uppermost DOM layer, which is not an xml-node
            let out='';
            // console.log(node.children);
            for (let i = 0; i < node.childNodes.length; i++)
                out += XML.toString(node.childNodes[i], options, level);
            return out;
            // return node.children.map(node=>XML.toString(node, options)).join('\n'); 
        }
        if( options.skipEmptyNodes && node.attributes.length==0 && node.childNodes.length==0) return '';
        // let output = tabs + tag('control') + lt + tag('control', 1) + tag('tag') + node.tagName + tag('tag', 1); // >\n
        let output = tabs + tag('control', lt) + tag('tag', node.tagName); // >\n
        let hasOnlyOneTextChild = ((node.childNodes.length == 1) && (node.childNodes[0].nodeType == 3) && !node.childNodes[0].textContent.trim().includes('\n'));
        let hasOnlyEmptyTextChild = hasOnlyOneTextChild && (node.childNodes[0].textContent.trim() == '');
        for (let i = 0; i < node.attributes.length; i++)
            if(!(options.skipEmptyAttributes && !node.attributes[i].value))
                output += ' ' + tag('pair', tag('attribute', node.attributes[i].name, node.attributes[i].name) + tag('control', '="') + tag('value', escapeValue(node.attributes[i].value), valueType(node.attributes[i].value)) + tag('control', '"'));
        // output += ` ${tag('attribute', node.attributes[i].name)}${tag('control', '="')}${tag('value', node.attributes[i].value)}${tag('control', '"')}`;
        // output += ` ${tag('attribute')}${node.attributes[i].name}${tag('attribute', 1)}${tag('control')}="${tag('control', 1)}${tag('value')}${node.attributes[i].value}${tag('value', 1)}${tag('control')}"${tag('control', 1)}`;
        // if ((node.childNodes.length == 0) || hasOnlyEmptyTextChild) return output + tag('control') + ' /' + gt + tag('control', 1) + newLine;
        if ((node.childNodes.length == 0) || hasOnlyEmptyTextChild) return output + tag('control', ' /' + gt) + newLine;
        else output += tag('control', gt);
        // else output += tag('control') + gt + tag('control', 1);
        if (!hasOnlyOneTextChild) output += newLine;
        for (let i = 0; i < node.childNodes.length; i++)
            if (hasOnlyOneTextChild) output += tag('content', node.childNodes[i].textContent.trim(), valueType(node.childNodes[i].textContent.trim()));
            else output += XML.toString(node.childNodes[i], options, level + 1);
        return output + (hasOnlyOneTextChild ? '' : tabs) + tag('control', lt + '/') + tag('tag', node.tagName) + tag('control', gt) + newLine;
        // return output + (hasOnlyOneTextChild ? '' : tabs) + tag('control') + lt + `/` + tag('control', 1) + tag('tag') + node.tagName + tag('tag', 1) + tag('control') + gt + tag('control', 1) + newLine;
    }
}

