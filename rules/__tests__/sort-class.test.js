const RuleTester = require('eslint').RuleTester;
const rule = require('../sort-class');

const ERR_SORT_CLASS_BODY =
  'class methods and properties should be sorted alphabetically';

const ruleTester = new RuleTester({
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  }
});

ruleTester.run('cake-sort-module', rule, {
  valid: [
    `
class Foo {
  cba() {}
  // -- split ----
  abc() {}
}
    `,
    `
class Foo extends Bar {
  constructor() {
    // hello
  }

  // -- static stuff -----
  static a = 'cat';
  static b = 'dog';

  // -- lifecycle methods ----
  render() {
    // render some dom
  }

  // -- public methods ----
  abc() {
    // do some things
  }

  cba() {
    // do them the other way
  }

  // -- event handlers ----
  _handleClick = (e) => {
    // detonate the confetti bomb
  }
}
    `
  ],
  invalid: [
    {
      code: `
class foo {
  b() {}
  a() {}
}
      `,
      errors: [ERR_SORT_CLASS_BODY]
    }
  ]
});
