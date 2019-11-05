
var XML = require('../src/xml').XML;


xml = `<body><style>
                td{text-align:center;}
            </style><test>abc<schmonk></schmonk></test><table><tr id='1'><th>Month</th><th>Bags</th><th>Cars</th><th>Bikes</th></tr><tr><td class='jo'>
            2019-01</td><td>57</td><td>9</td><td>74</td></tr><tr><td>2019-02</td><td>41</td><td>16</td><td>71</td></tr><tr><td>2019-03</td><td>37
            </td><td>11</td><td>57</td>
</tr><tr><td>2019-04</td><td>39</td><td>11</td><td>
78</td></tr><tr><td>2019-05</td><td>39</td><td>10</td><td>78</td></tr><tr><td>2019-06
</td><td>38</td><td>11</td><td>63</td></tr><tr><td>2019-07</td><td>30</td><td>4</td><td>57</td></tr><tr><td>2019-08</td>
<td>14</td><td>2</td><td>7</td></tr></table></body>`;

console.log( XML.prettify(xml) );
console.log( XML.minify(xml) );
console.log( XML.highlight(xml) );

