# eslint-plugin-cake

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

ESLint plugin that implements Cake specific styling rules

## Usage

Add `cake` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "cake"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "cake/sort-imports": "warn"
    }
}
```

## Supported Rules

* cake/sort-imports
