/*
Enforce Cake standard class sorting rules.

To better understand this module, take a look at the estree terminology:

https://github.com/estree/estree/blob/master/es2015.md#imports

Sort class methods and properties alphabetically within each section of the
class body. A section is defined by a comment on its own line of the form
// -- *. Example:

```
class FooBar {
  static foo = 'cat';

  // -- Private Methods -----
  bar() { // "bar" < "foo" but this is a new section
    return 'dog';
  }
}
```

In the above case, even though bar comes after foo, it is in its own section
that is delimited by the above comment.
*/

const DEFAULT_DELIMITER_PATTERN = ' -- ';
const ERR_SORT_CLASS_BODY =
  'class methods and properties should be sorted alphabetically';

module.exports = {
  meta: {
    docs: {
      description: 'Sort class bodies alphabetically'
    },
    schema: []
  },

  create: context => {
    let commentLines;

    return {
      Program: node => {
        // NOTE: we can't rely on leadingComments and trailingComments from the
        // AST. This is because they are only defined if they exist on the node
        // directly before or after the node in question.
        commentLines = node.comments
          .filter(isSectionComment)
          .map(comment => comment.loc.start.line);
      },

      ClassBody: node => {
        let allowConstructorFirst = true;
        let lastSortString = null;
        let nextCommentLine = commentLines.shift();

        for (let i = 0; i < node.body.length; i++) {
          // Allow constructor to be the first node.
          if (
            i === 0 &&
            allowConstructorFirst &&
            node.body[i].type === 'MethodDefinition' &&
            node.body[i].key.name === 'constructor'
          ) {
            continue;
          }

          let bodyNode = node.body[i];

          // Get rid of any leftover comments before this node
          while (nextCommentLine < bodyNode.loc.start.line) {
            nextCommentLine = commentLines.shift();
          }

          let sortString = getSortString(bodyNode);

          if (lastSortString && sortString < lastSortString) {
            context.report({
              node: bodyNode,
              message: ERR_SORT_CLASS_BODY
            });
          }

          // if there is a section delimiter between this node and the next node
          // then set the sort string to null, otherwise, set the lastSortString
          // to this node string.
          let nextNode = node.body[i + 1];
          if (nextNode && nextCommentLine < nextNode.loc.start.line) {
            lastSortString = null;
          } else {
            lastSortString = sortString;
          }
        }
      }
    };
  }
};

function getSortString(node) {
  if (node.type === 'MethodDefinition') {
    return node.key.name;
  } else if (node.type === 'ClassProperty') {
    return node.key.name;
  } else {
    throw new Error(`Unrecognized class body node ${node.type}`);
  }
}

function isSectionComment(comment) {
  return (
    comment.type == 'Line' &&
    comment.value.startsWith(DEFAULT_DELIMITER_PATTERN)
  );
}
