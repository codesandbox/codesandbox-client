const { createFilePath } = require('gatsby-source-filesystem');
const { resolve, dirname } = require('path');

// Parse date information out of post filename.
const BLOG_POST_FILENAME_REGEX = /([0-9]+)\-([0-9]+)\-([0-9]+)\-(.+)\.md$/;
const DOCUMENTATION_FILENAME_REGEX = /[0-9]+-(.*)\.md$/;

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
    const { url } = node.frontmatter;
    const { relativePath } = getNode(node.parent);

    createNodeField({
      node,
      name: 'path',
      value: relativePath,
    });

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
    } else {
      const match = DOCUMENTATION_FILENAME_REGEX.exec(relativePath);

      createNodeField({
        node,
        name: `slug`,
        value: `docs/${match[1]}`,
      });
    }

    // Used by createPages() above to register redirects.
    createNodeField({
      node,
      name: 'url',
      value: url ? '/docs' + url : node.fields.slug,
    });
  }
};

exports.createPages = async ({ graphql, boundActionCreators }) => {
  const { createPage, createRedirect } = boundActionCreators;

  const docsTemplate = resolve(__dirname, './src/templates/docs.js');

  // Redirect /index.html to root.
  createRedirect({
    fromPath: '/index.html',
    redirectInBrowser: true,
    toPath: '/',
  });

  const allMarkdown = await graphql(
    `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              fields {
                slug
                url
              }
            }
          }
        }
      }
    `
  );

  if (allMarkdown.errors) {
    console.error(allMarkdown.errors);

    throw Error(allMarkdown.errors);
  }

  allMarkdown.data.allMarkdownRemark.edges.forEach(edge => {
    const slug = edge.node.fields.slug;
    const url = edge.node.fields.url;

    if (slug.includes('docs/')) {
      let template;
      if (slug.includes('docs/')) {
        template = docsTemplate;
      }

      const createArticlePage = path =>
        createPage({
          path,
          component: template,
          context: {
            slug,
          },
        });

      // Register primary URL.
      createArticlePage(url || slug);
    }
  });
};

exports.modifyWebpackConfig = ({ config }) => {
  config.merge({
    resolve: {
      root: resolve(__dirname, './src'),
      extensions: ['', '.js', '.jsx', '.json'],
    },
  });

  config._config.resolve.alias = {
    react: dirname(require.resolve('react')),
    'react-dom': dirname(require.resolve('react-dom')),
  };

  return config;
};
