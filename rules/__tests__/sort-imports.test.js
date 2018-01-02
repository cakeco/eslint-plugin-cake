const RuleTester = require('eslint').RuleTester;
const rule = require('../sort-imports');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  }
});

const ERR_RELATIVE_GROUP_ORDER = {
  message: 'external modules should be imported before internal modules',
  type: 'ImportDeclaration'
};

const ERR_SPECIFIER_GROUP_ORDER = {
  message: 'import groupings should follow the order: destructured, unnamed, wildcard, default',
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

ruleTester.run("cake-sort-imports", rule, {
  valid: [
    `
      import a from 'foo';
      import b from './bar';
    `,
    `
      import { a, b } from 'foo';
      import 'bar';
      import c from 'baz';

      import { d, e } from './blarg';
      import './blinkblink';
      import * as star from './spangle';
      import blech from './foobar';
      import zoinks from './pinky';
    `,
    // https://paper.dropbox.com/doc/Coding-Conventions-kBrQekv8hpRbbmqCdUUcS
    `
      import { createSelector } from 'reselect';
      import { Editor } from 'slate';
      import flatten from 'lodash/flatten';
      import React, { Component } from 'react';

      import { markdownToHtml } from '../lib/markdown';
      import { stringify } from '../lib/betterQueryString';
      import * as actionCreators from './state';
      import CSS from './CSS';
      import Link from './Link';
    `,
    `
      import './kittens';
      import './puppies';
    `,
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
