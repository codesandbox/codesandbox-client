/* eslint-disable */
export default function({ template, types: t }) {
  const buildImport = template(`
    Promise.resolve().then(() => require(SOURCE))
  `);

  return {
    visitor: {
      Import(path) {
        const importArguments = path.parentPath.node.arguments;
        const newImport = buildImport({
          SOURCE:
            t.isStringLiteral(importArguments[0]) ||
            t.isTemplateLiteral(importArguments[0])
              ? importArguments
              : t.templateLiteral(
                  [
                    t.templateElement({ raw: '', cooked: '' }),
                    t.templateElement({ raw: '', cooked: '' }, true),
                  ],
                  importArguments
                ),
        });
        path.parentPath.replaceWith(newImport);
      },
    },
  };
}
