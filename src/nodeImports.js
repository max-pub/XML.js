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
