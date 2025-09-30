const Asciidoctor = require('asciidoctor')
const asciidoctor = Asciidoctor()

const content = 'http://asciidoctor.org[*Asciidoctor*] ' +
  'running on https://opalrb.com[_Opal_] ' +
  'brings AsciiDoc to Node.js!'
const html = asciidoctor.convert(content) // (2)
console.log(html) 
