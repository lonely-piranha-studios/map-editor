// This files needs to be in ES5 / commonJS since it's loaded before Babel

require('babel-core/register')({
  presets: [
    ['es2015'],
    // We need to overwrite this config since modules: false breaks mocha

    'stage-2',
    // Specifies what level of language features to activate.
    // Stage 2 is "draft", 4 is finished, 0 is strawman.
    // See https://tc39.github.io/process-document/

    'react'
    // Transpile React components to JavaScript
  ]
});

const chai = require('chai');
const chaiImmutable = require('chai-immutable');

chai.use(chaiImmutable);
