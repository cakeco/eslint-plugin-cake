/*
Enforce Cake standard import sorting rules.

To better understand this module, take a look at the estree terminology:

https://github.com/estree/estree/blob/master/es2015.md#imports
*/

const IMPORT_DEFAULT_SPECIFIER = 'ImportDefaultSpecifier';
const IMPORT_NAMESPACE_SPECIFIER = 'ImportNamespaceSpecifier';
const IMPORT_NO_SPECIFIER = 'ImportNoSpecifier';
const IMPORT_SPECIFIER = 'ImportSpecifier';

const VALID_SPECIFIERS = [
  IMPORT_DEFAULT_SPECIFIER,
  IMPORT_NAMESPACE_SPECIFIER,
  IMPORT_NO_SPECIFIER,
  IMPORT_SPECIFIER
];

const SPECIFIER_GROUP_MAP = {
  [IMPORT_SPECIFIER]: 1, // destructured
  [IMPORT_NO_SPECIFIER]: 0, // no naming
  [IMPORT_NAMESPACE_SPECIFIER]: 2, // wildcard (star)
  [IMPORT_DEFAULT_SPECIFIER]: 3,
};

module.exports = {
  meta: {
    docs: {
      description: "Sort imports according to cake style"
    }
  },

  create: context => {
    let lastImport;

    return {
      ImportDeclaration: node => {
        let specifierType = getSpecifierType(node);

        let nextImport = {
          isRelative: isRelative(node),
          specifierType,
          specifierGroup: getSpecifierGroup(specifierType),
          sortableString: getSortableString(node)
        };

        // destructured import name sorting
        if (nextImport.specifierType === IMPORT_SPECIFIER
          && node.specifiers.length > 1) {

          let lastName;

          for (let specifier of node.specifiers) {
            let name = specifier.local.name.toLowerCase();

            if (name < lastName) {
              context.report({
                node: specifier,
                message: 'import names should be sorted alphabetically'
              });
            }

            lastName = name;
          }
        }

        // import declaration sorting
        if (lastImport) {
          if (!nextImport.isRelative && lastImport.isRelative) {
            context.report({
              node,
              message: 'external modules should be imported before internal modules'
            });
          } else if (lastImport.isRelative === nextImport.isRelative) {
            // In same path relativity group
            if (
              lastImport.specifierGroup > nextImport.specifierGroup
            ) {
              context.report({
                node,
                message: 'import groupings should follow the order: unnamed, destructured, wildcard, default'
              });
            } else if (lastImport.specifierType === nextImport.specifierType) {
              // In same specifier type group
              if (nextImport.sortableString < lastImport.sortableString) {
                context.report({
                  node,
                  message: 'import declarations should be sorted alphabetically'
                });
              }
            }
          }
        }

        lastImport = nextImport;
      }
    };
  }
};

// -- Private Methods ----------------------------------------------------------
/**
True if the import is referencing a relative module, false if it is something in
the global namespace.
*/
function isRelative(node) {
  let rawValue = node.source.value;

  return rawValue.startsWith('./')
    || rawValue.startsWith('../');
}

function getSpecifierType(node) {
  if (node.specifiers.length === 0) {
    return IMPORT_NO_SPECIFIER;
  }

  let specifierType = node.specifiers[0].type;

  if (VALID_SPECIFIERS.includes(specifierType)) {
    return specifierType;
  } else {
    throw new Error(`Unrecognized specifier ${specifierType}`);
  }
}

function getSpecifierGroup(specifierType) {
  return SPECIFIER_GROUP_MAP[specifierType];
}

function getSortableString(node) {
  // no specifier
  if (node.specifiers.length === 0) {
    return node.source.value;
  }

  return node.specifiers[0].local.name.toLowerCase();
}
