const input = require('./input');
const output = require('./output');
const store = require('./store');

require('./mediator')(
  document,
  input,
  output,
  store,
);
