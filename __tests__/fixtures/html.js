const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../../src/html/index.html'), 'utf8');
// const { JSDOM } = require('jsdom');
// const doc = new JSDOM(html.toString());

// module.exports = doc.window.document;
module.exports = html;