const env = require('@codesandbox/common/lib/config/env');
const semver = require('semver');
const slugify = require('@sindresorhus/slugify');
const { createFilePath } = require('gatsby-source-filesystem');
const noop = require('lodash/noop');
const path = require('path');
const fetch = require('node-fetch');

const getRelativePath = absolutePath => absolutePath.replace(__dirname, '');

const getNodeType = ({ fileAbsolutePath }) =>
  getRelativePath(fileAbsolutePath).split('/')[2];

const getEpisodeNumber = (filePath, podcast) => {
  if (!filePath || !filePath.trim().length) return '';
  return parseInt(filePath.split(`/${podcast}/`)[1].split('/')[0], 10);
};

const getBlogNodeInfo = ({
  node: {
    frontmatter: { authors, date, description, photo },
  },
}) => ({
  authors,
  date,
  description,
  photo,
});
const getDocsSlug = ({ node: { fileAbsolutePath } }) => {
  const fileName = getRelativePath(fileAbsolutePath).split('/').reverse()[0];

  return fileName.split('.md')[0].split('-')[1];
};
const getDocsNodeInfo = ({
  node: {
    frontmatter: { description, slug },
    ...node
  },
}) => ({
  description,
  slug: slug || `/${getDocsSlug({ node })}`,
});
const getJobsNodeInfo = ({
  node: {
    frontmatter: { applySlug },
  },
}) => ({
  applyLink: `https://codesandbox.recruitee.com/o/${applySlug}`,
});
const getLegalNodeInfo = ({
  node: {
    frontmatter: { lastEdited },
  },
}) => ({
  lastEdited,
});
const getSpecificNodeInfo = ({ node, nodeType }) => {
  const nodeInfoMap = {
    articles: getBlogNodeInfo,
    docs: getDocsNodeInfo,
    jobs: getJobsNodeInfo,
    legal: getLegalNodeInfo,
  };

  return (nodeInfoMap[nodeType] || noop)({ node });
};
const getGenericNodeInfo = ({ node }) => {
  const {
    fileAbsolutePath,
    frontmatter: { slug, title },
  } = node;
  const relativeFilePath = getRelativePath(fileAbsolutePath);

  return {
    editLink: `https://github.com/codesandbox/codesandbox-client/edit/master/packages/homepage${relativeFilePath}`,
    slug: slug || slugify(title),
    title,
  };
};
const getNodeInfo = ({ node, nodeType }) => ({
  ...getGenericNodeInfo({ node }),
  ...getSpecificNodeInfo({ node, nodeType }),
});

const createNodeFieldsFromNodeInfo = ({
  createNodeField,
  nodeFieldNames,
  nodeInfo,
}) => {
  nodeFieldNames.forEach(nodeFieldName => {
    createNodeField({ name: nodeFieldName, value: nodeInfo[nodeFieldName] });
  });
};
const createBlogNodeFields = ({ createNodeField, nodeInfo }) => {
  createNodeFieldsFromNodeInfo({
    createNodeField,
    nodeFieldNames: ['authors', 'date', 'description', 'photo'],
    nodeInfo,
  });
};
const createDocsNodeFields = ({ createNodeField, nodeInfo }) => {
  createNodeFieldsFromNodeInfo({
    createNodeField,
    nodeFieldNames: ['description'],
    nodeInfo,
  });
};
const createJobsNodeFields = ({ createNodeField, nodeInfo }) => {
  createNodeFieldsFromNodeInfo({
    createNodeField,
    nodeFieldNames: ['applyLink'],
    nodeInfo,
  });
};
const createLegalNodeFields = ({ createNodeField, nodeInfo }) => {
  createNodeFieldsFromNodeInfo({
    createNodeField,
    nodeFieldNames: ['lastEdited'],
    nodeInfo,
  });
};
const createSpecificNodeFields = ({ createNodeField, nodeInfo, nodeType }) => {
  const createNodeFieldsMap = {
    articles: createBlogNodeFields,
    docs: createDocsNodeFields,
    jobs: createJobsNodeFields,
    legal: createLegalNodeFields,
  };

  (createNodeFieldsMap[nodeType] || noop)({ createNodeField, nodeInfo });
};
const createGenericNodeFields = ({
  createNodeField,
  getFilePathForNode,
  nodeInfo: { slug, ...nodeInfo },
}) => {
  createNodeFieldsFromNodeInfo({
    createNodeField,
    nodeFieldNames: ['editLink', 'title', 'slug'],
    nodeInfo: { ...nodeInfo, slug: slug || getFilePathForNode() },
  });
};
const createNodeFields = ({
  createNodeField,
  getFilePathForNode,
  nodeInfo,
  nodeType,
}) => {
  createGenericNodeFields({ createNodeField, getFilePathForNode, nodeInfo });

  createSpecificNodeFields({ createNodeField, nodeInfo, nodeType });
};

exports.onCreateNode = ({ actions: { createNodeField }, getNode, node }) => {
  if (node.internal.type === 'MarkdownRemark') {
    const createNodeFieldForNode = ({ name, value }) =>
      createNodeField({ name, node, value });
    const getFilePathForNode = () =>
      createFilePath({ getNode, node, trailingSlash: false });
    const nodeType = getNodeType(node);
    const nodeInfo = getNodeInfo({ node, nodeType });

    createNodeFields({
      createNodeField: createNodeFieldForNode,
      getFilePathForNode,
      nodeInfo,
      nodeType,
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  const docsTemplate = path.resolve(__dirname, './src/templates/docs.js');
  const blogTemplate = path.resolve(__dirname, './src/templates/post.js');
  const seoPagesTemplate = path.resolve(__dirname, './src/templates/seo.js');
  const oldTermsTemplate = path.resolve(__dirname, './src/templates/terms.js');
  const oldPrivacyTemplate = path.resolve(
    __dirname,
    './src/templates/privacy.js'
  );

  const featureTemplate = path.resolve(__dirname, './src/templates/feature.js');
  const episodeTemplate = path.resolve(
    __dirname,
    './src/templates/podcast-episode.js'
  );
  // Redirect /index.html to root.
  createRedirect({
    fromPath: '/index.html',
    redirectInBrowser: true,
    toPath: '/',
  });

  const allMarkdownSeoPages = await graphql(`
    {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/seo/" } }) {
        edges {
          node {
            id
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);
  allMarkdownSeoPages.data.allMarkdownRemark.edges.forEach(edge => {
    createPage({
      path: edge.node.frontmatter.slug,
      component: seoPagesTemplate,
      context: { id: edge.node.id },
    });
  });

  const allMarkdownArticles = await graphql(`
    {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/articles/" } }) {
        edges {
          node {
            id
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);
  allMarkdownArticles.data.allMarkdownRemark.edges.forEach(edge => {
    const { slug } = edge.node.frontmatter;
    const { id } = edge.node;

    createPage({
      path: 'post/' + slug,
      component: blogTemplate,
      context: {
        id,
      },
    });
  });

  const allDocs = await graphql(`
    {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/docs/" }
          fields: { slug: { nin: ["/api", "/faqs"] } }
        }
        sort: { fields: [fileAbsolutePath], order: [ASC] }
      ) {
        edges {
          node {
            fields {
              slug
              title
            }
          }
        }
      }
    }
  `);
  if (allDocs.errors) {
    console.error(allDocs.errors);

    throw Error(allDocs.errors);
  }
  allDocs.data.allMarkdownRemark.edges.forEach(({ node }, index) => {
    const {
      fields: { slug },
    } = node;
    const all = allDocs.data.allMarkdownRemark.edges;
    const prev = index === 0 ? {} : all[index - 1].node;
    const next = index === all.length - 1 ? {} : all[index + 1].node;
    createPage({
      path: `docs${slug}`,
      component: docsTemplate,
      context: {
        slug,
        prev,
        next,
      },
    });
  });

  // FEATURES

  const allFeatures = await graphql(`
    {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/features/" } }) {
        edges {
          node {
            id
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);
  if (allFeatures.data) {
    allFeatures.data.allMarkdownRemark.edges.forEach(edge => {
      createPage({
        path: edge.node.frontmatter.slug,
        component: featureTemplate,
        context: { id: edge.node.id },
      });
    });
  }

  // Podcasts

  const version1 = await graphql(`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/podcasts/version-one/" } }
      ) {
        edges {
          node {
            id
            fileAbsolutePath
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);
  if (version1.data) {
    version1.data.allMarkdownRemark.edges.forEach(edge => {
      const ids = version1.data.allMarkdownRemark.edges
        .map(e => ({
          id: e.node.id,
          episodeNumber: getEpisodeNumber(
            e.node.fileAbsolutePath,
            'version-one'
          ),
        }))
        .filter(
          file =>
            file.episodeNumber ===
            getEpisodeNumber(edge.node.fileAbsolutePath, 'version-one')
        )
        .map(a => a.id);

      createPage({
        path: `/podcasts/version-one/` + edge.node.frontmatter.slug,
        component: episodeTemplate,
        context: { ids },
      });
    });
  }

  const csb = await graphql(`
    {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/podcasts/codesandbox-podcast/" }
        }
      ) {
        edges {
          node {
            id
            fileAbsolutePath
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);
  if (csb.data) {
    csb.data.allMarkdownRemark.edges
      .filter(e => e.node.frontmatter.slug)
      .forEach(edge => {
        const ids = csb.data.allMarkdownRemark.edges
          .map(e => ({
            id: e.node.id,
            episodeNumber: getEpisodeNumber(
              e.node.fileAbsolutePath,
              'codesandbox-podcast'
            ),
          }))
          .filter(
            file =>
              file.episodeNumber ===
              getEpisodeNumber(
                edge.node.fileAbsolutePath,
                'codesandbox-podcast'
              )
          )
          .map(a => a.id);
        createPage({
          path: `/podcasts/codesandbox-podcast/` + edge.node.frontmatter.slug,
          component: episodeTemplate,
          context: { ids },
        });
      });
  }

  const allOldTerms = await graphql(`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/legal/terms/" } }
      ) {
        edges {
          node {
            id
            html
            frontmatter {
              version
              lastEdited
            }
          }
        }
      }
    }
  `);
  if (allOldTerms.data) {
    const edges = allOldTerms.data.allMarkdownRemark.edges;
    const versions = edges.map(edge => edge.node.frontmatter.version);
    const all = versions.sort(semver.rcompare);
    const olderVersions = edges.filter(
      edge => edge.node.frontmatter.version !== all[0]
    );
    olderVersions.forEach(edge => {
      createPage({
        path: `/legal/terms/version/` + edge.node.frontmatter.version,
        component: oldTermsTemplate,
        context: { id: edge.node.id },
      });
    });
  }

  const oldPrivacy = await graphql(`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/legal/privacy/" } }
      ) {
        edges {
          node {
            id
            html
            frontmatter {
              version
              lastEdited
            }
          }
        }
      }
    }
  `);
  if (oldPrivacy.data) {
    const edges = oldPrivacy.data.allMarkdownRemark.edges;
    const versions = edges.map(edge => edge.node.frontmatter.version);
    const all = versions.sort(semver.rcompare);
    const olderVersions = edges.filter(
      edge => edge.node.frontmatter.version !== all[0]
    );
    olderVersions.forEach(edge => {
      createPage({
        path: `/legal/privacy/version/` + edge.node.frontmatter.version,
        component: oldPrivacyTemplate,
        context: { id: edge.node.id },
      });
    });
  }
};

exports.onCreateWebpackConfig = ({ getConfig, loaders, actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [plugins.define(env.default)],
  });

  const config = getConfig();

  config.module.rules = [
    // Omit the default rule where test === '\.jsx?$'
    ...config.module.rules.filter(
      rule => String(rule.test) !== String(/\.jsx?$/)
    ),

    // Recreate it with custom exclude filter
    {
      // Called without any arguments, `loaders.js` will return an
      // object like:
      // {
      //   options: undefined,
      //   loader: '/path/to/node_modules/gatsby/dist/utils/babel-loader.js',
      // }
      // Unless you're replacing Babel with a different transpiler, you probably
      // want this so that Gatsby will apply its required Babel
      // presets/plugins.  This will also merge in your configuration from
      // `babel.config.js`.
      ...loaders.js(),

      test: /\.jsx?$/,

      // Exclude all node_modules from transpilation, except for 'common' and 'app'
      exclude: modulePath =>
        /node_modules/.test(modulePath) &&
        !/node_modules\/(common|app)/.test(modulePath),
    },
  ];

  if (process.env.CIRCLECI && config.optimization) {
    // eslint-disable-next-line no-console
    console.log('Setting new parallel option for CircleCI');
    // CircleCI has 32cpu cores, but only 2 for us. os.cpu().length gives back 32, which always results in OOM
    config.optimization.minimizer[0].options.parallel = 2;
  }

  // This will completely replace the webpack config with the modified object.
  actions.replaceWebpackConfig(config);
};

exports.sourceNodes = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const data = await fetch(
    'https://codesandbox.io/api/v1/sandboxes/templates/official'
  );
  const json = await data.json();

  return new Promise(resolve => {
    json[0].sandboxes.forEach(template => {
      const node = {
        // Content
        alias: template.alias,
        author: template.author,
        custom_template: template.custom_template,
        description: template.description,
        environment: template.environment,
        inserted_at: template.inserted_at,
        template_id: template.id,
        title: template.title,
        updated_at: template.updated_at,

        // Required fields
        id: createNodeId(template.alias),
        parent: null,
        children: [],
        internal: {
          type: `OfficialTemplate`,
          contentDigest: createContentDigest(template),
        },
      };

      createNode(node);
    });

    resolve();
  });
};
