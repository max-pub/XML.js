try {
    var DOMParser = require('xmldom').DOMParser;
    var XMLSerializer = require('xmldom').XMLSerializer;
} catch (e) { }

XML = {
    parse: (string, type = 'text/xml') => new DOMParser().parseFromString(string, type),  // like JSON.parse
    stringify: DOM => new XMLSerializer().serializeToString(DOM),                         // like JSON.stringify

    transform: (xml, xsl) => {
        let proc = new XSLTProcessor();
        proc.importStylesheet(typeof xsl == 'string' ? XML.parse(xsl) : xsl);
        let output = proc.transformToFragment(typeof xml == 'string' ? XML.parse(xml) : xml, document);
        return typeof xml == 'string' ? XML.stringify(output) : output; // if source was string then stringify response, else return object
    },

    minify: node => XML.toString(node),
    prettify: node => XML.toString(node, { prettify: true }),
    highlight: node => XML.toString(node, { prettify: true, highlight: true }),
    toString: (node, options, level = 0) => {
        options = { ...{ prettify: false, highlight: false }, ...options };
        if (typeof node == 'string') node = XML.parse(node);
        let tabs = options.prettify ? Array(level + 1).fill('').join('\t') : '';
        let newLine = options.prettify ? '\n' : '';
        let lt = options.highlight ? '&lt;' : '<';
        let gt = options.highlight ? '&gt;' : '>';
        let tag = (name, close) => (options.highlight ? '<' + (close ? '/' : '') + name + '>' : '');
        if (node.nodeType == 3 && !node.textContent.trim()) return ''; // if textContent is only linebreaks or spaces, return nothing
        if (node.nodeType == 3) return tabs + node.textContent.trim() + newLine;
        if (!node.tagName) return XML.toString(node.firstChild, options); // only relevant for the uppermost DOM layer, which is not an xml-node
        let output = tabs + tag('control') + lt + tag('control', 1) + tag('tag') + node.tagName + tag('tag', 1); // >\n
        for (let i = 0; i < node.attributes.length; i++)
            output += ` ${tag('attribute')}${node.attributes[i].name}${tag('attribute', 1)}${tag('control')}="${tag('control', 1)}${tag('value')}${node.attributes[i].value}${tag('value', 1)}${tag('control')}"${tag('control', 1)}`;
        if (node.childNodes.length == 0) return output + tag('control') + ' /' + gt + tag('control', 1) + newLine;
        else output += tag('control') + gt + tag('control', 1);
        let hasOnlyOneTextChild = ((node.childNodes.length == 1) && (node.childNodes[0].nodeType == 3));
        if (!hasOnlyOneTextChild) output += newLine;
        for (let i = 0; i < node.childNodes.length; i++)
            if (hasOnlyOneTextChild) output += node.childNodes[i].textContent.trim();
            else output += XML.toString(node.childNodes[i], options, level + 1);
        return output + (hasOnlyOneTextChild ? '' : tabs) + tag('control') + lt + `/` + tag('control', 1) + tag('tag') + node.tagName + tag('tag', 1) + tag('control') + gt + tag('control', 1) + newLine;
    }
}

module.exports.XML = XML;