/**
 * We add a section around headers + content. This way we can create cards
 */
module.exports = ({ markdownAST }) => {
  let headingMode = false;

  for (let i = 0; i < markdownAST.children.length; i++) {
    const child = markdownAST.children[i];

    if (i === markdownAST.children.length - 1 && headingMode) {
      markdownAST.children.push({
        type: 'html',
        value: '</section>',
      });

      return;
    }
    if (child.type === 'heading' && child.depth === 2) {
      if (headingMode) {
        markdownAST.children.splice(i, 0, {
          type: 'html',
          value: '</section>',
        });
      } else {
        markdownAST.children.splice(i, 0, {
          type: 'html',
          value: '<section>',
        });
        i++;
      }

      headingMode = !headingMode;
    }
  }
};
