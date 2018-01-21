const RuleTester = require('eslint').RuleTester;
const rule = require('../sort-imports');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});

const ERR_RELATIVE_GROUP_ORDER = {
  message: 'external modules should be imported before internal modules',
  type: 'ImportDeclaration'
};

const ERR_SPECIFIER_GROUP_ORDER = {
  message:
    'import groupings should follow the order: unnamed, destructured, wildcard, default',
  type: 'ImportDeclaration'
};

const ERR_ALPHABET_IMPORT_ORDER = {
  message: 'import declarations should be sorted alphabetically',
  type: 'ImportDeclaration'
};

const ERR_ALPHABET_SPECIFIER_ORDER = {
  message: 'import names should be sorted alphabetically',
  type: 'ImportSpecifier'
};

ruleTester.run('cake-sort-imports', rule, {
  valid: [
    `
      import a from 'foo';
      import b from './bar';
    `,
    `
      import 'bar';
      import { a, b } from 'foo';
      import c from 'baz';

      import './blinkblink';
      import { d, e } from './blarg';
      import * as star from './spangle';
      import blech from './foobar';
      import zoinks from './pinky';
    `,
    `
      import { foo } from 'bar';
      import { Kitten } from 'cat';
      import dog from 'animal/dog';
      import Pizza, { Pasta } from 'italian';

      import './lib/bootstrap';
      import { enemy, friend } from './lib/people';
      import { Epsilon } from './lib/greek';
      import * as money from './currency';
      import Kaboom from './Kaboom';
      import Zoo from './Zoo';
    `,
    `
      import './kittens';
      import './puppies';
    `
  ],
  invalid: [
    {
      code: `
        import b from './bar';
        import a from 'foo';
      `,
      errors: [ERR_RELATIVE_GROUP_ORDER]
    },

    {
      code: `
        import b from 'bar';
        import { a } from 'foo';
      `,
      errors: [ERR_SPECIFIER_GROUP_ORDER]
    },

    {
      code: `
        import b from 'bar';
        import a from 'foo';
      `,
      errors: [ERR_ALPHABET_IMPORT_ORDER]
    },

    {
      code: `
        import { b, a } from 'foo';
      `,
      errors: [ERR_ALPHABET_SPECIFIER_ORDER]
    },

    {
      code: `
        import './puppies';
        import './kittens';
      `,
      errors: [ERR_ALPHABET_IMPORT_ORDER]
    }
  ]
});
