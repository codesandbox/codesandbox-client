const { createFilePath } = require('gatsby-source-filesystem');

// Parse date information out of post filename.
const BLOG_POST_FILENAME_REGEX = /([0-9]+)\-([0-9]+)\-([0-9]+)\-(.+)\.md$/;

function dateToLocalJSON(date) {
  function addZ(n) {
    return (n < 10 ? '0' : '') + n;
  }
  return (
    date.getFullYear() +
    '-' +
    addZ(date.getMonth() + 1) +
    '-' +
    addZ(date.getDate())
  );
}

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators;

  if (node.internal.type === `MarkdownRemark`) {
    const { relativePath } = getNode(node.parent);

    if (relativePath.includes('changelog')) {
      // The date portion comes from the file name: <date>-<title>.md
      const match = BLOG_POST_FILENAME_REGEX.exec(relativePath);
      const year = match[1];
      const month = match[2];
      const day = match[3];
      const slug = match[4];

      const date = new Date(year, month - 1, day, 0, 0);

      // Blog posts are sorted by date and display the date in their header.
      createNodeField({
        node,
        name: 'date',
        value: dateToLocalJSON(date),
      });
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      });
    }
  }
};
