XML = {
    parse: (string, type = 'text/xml') => new DOMParser().parseFromString(string, type),  // like JSON.parse
    stringify: DOM => new XMLSerializer().serializeToString(DOM),                         // like JSON.stringify
    fetch: async url => XML.parse(await fetch(url).then(x => x.text())),
    transform: (xml, xsl, stringOutput = true) => {
        let processor = new XSLTProcessor();
        processor.importStylesheet(typeof xsl == 'string' ? XML.parse(xsl) : xsl);
        let output = processor.transformToFragment(typeof xml == 'string' ? XML.parse(xml) : xml, document);
        return stringOutput ? XML.stringify(output) : output;
        // return typeof xml == 'string' ? XML.stringify(output) : output; // if source was string then stringify response, else return object
    }
}

