
XML = {
    ...XML, ...{
        minify: node => XML.toString(node),
        prettify: node => XML.toString(node, { prettify: true }),
        highlight: node => XML.toString(node, { prettify: true, highlight: true }),
        toString: (node, options, level = 0) => {
            // if(!node) return;
            options = { ...{ prettify: false, highlight: false, inlineTags: ['b', 'i', 'u', 'q'] }, ...options };
            if (typeof node == 'string') node = XML.parse(node);
            let tabs = options.prettify ? Array(level + 1).fill('').join('\t') : '';
            let newLine = options.prettify ? '\n' : '';
            let lt = options.highlight ? '&lt;' : '<';
            let gt = options.highlight ? '&gt;' : '>';
            // let tag = (name, close) => (options.highlight ? '<' + (close ? '/' : '') + name + '>' : '');
            let tag = (name, value, _class = '') => (options.highlight ? `<${name} ${_class ? `class='${_class}'` : ''}>${value}</${name}>` : value);
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
            if (!node.tagName) return XML.toString(node.firstChild, options); // only relevant for the uppermost DOM layer, which is not an xml-node
            // let output = tabs + tag('control') + lt + tag('control', 1) + tag('tag') + node.tagName + tag('tag', 1); // >\n
            let output = tabs + tag('control', lt) + tag('tag', node.tagName); // >\n
            let hasOnlyOneTextChild = ((node.childNodes.length == 1) && (node.childNodes[0].nodeType == 3) && !node.childNodes[0].textContent.trim().includes('\n'));
            let hasOnlyEmptyTextChild = hasOnlyOneTextChild && (node.childNodes[0].textContent.trim() == '');
            for (let i = 0; i < node.attributes.length; i++)
                output += ' ' + tag('pair', tag('attribute', node.attributes[i].name, node.attributes[i].name) + tag('control', '="') + tag('value', node.attributes[i].value, valueType(node.attributes[i].value)) + tag('control', '"') );
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
}
