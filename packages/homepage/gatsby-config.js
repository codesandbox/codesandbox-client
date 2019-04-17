require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: `CodeSandbox`,
    siteUrl: 'https://codesandbox.io',
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 740,
              linkImagesToOriginal: true,
              sizeByPixelDensity: true,
            },
          },
          {
            resolve: require.resolve(`./plugins/remark-sections`),
          },
          'gatsby-remark-autolink-headers',
          `gatsby-remark-prismjs`,
          {
            resolve: 'gatsby-remark-embed-youtube',
            options: {
              width: 740,
              height: 370,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#40A9F3',
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-remove-trailing-slashes`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: 'GTM-T3L6RFK',
      },
    },
    {
      resolve: `gatsby-source-medium`,
      options: {
        username: `@compuives`,
        limit: 200,
      },
    },
    {
      resolve: `gatsby-source-rss-feed`,
      options: {
        url: `https://medium.com/feed/@compuives`,
        name: `MediumBlog`,
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Poppins:400,500,600,700,800`,
          `source sans pro:300,400,500,600,700`,
          'open sans:400',
        ],
      },
    },
    {
      resolve: `gatsby-source-airtable`,
      options: {
        apiKey: 'keyJugfwdJzOyL7Aa',
        tables: [
          {
            baseId: `app7kKUn5uIviyA1f`,
            tableName: `Table`,
            tableView: `Grid view`,
            queryName: `starters`,
          },
        ],
      },
    },
  ],
};
