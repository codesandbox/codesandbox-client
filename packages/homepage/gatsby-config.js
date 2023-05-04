require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: `CodeSandbox`,
    siteUrl: "https://codesandbox.io",
  },
  plugins: [
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `${__dirname}/content/`,
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        pedantic: false,
        plugins: [
          `gatsby-remark-component`,
          `gatsby-remark-copy-linked-files`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 768,
              linkImagesToOriginal: true,
            },
          },
          { resolve: require.resolve(`./plugins/remark-sections`) },
          "gatsby-remark-autolink-headers",
          `gatsby-remark-prismjs`,
          `gatsby-remark-embedder`,
        ],
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /screens/, // See below to configure properly
        },
      },
    },
    {
      resolve: "gatsby-plugin-nprogress",
      options: {
        color: "#40A9F3",
      },
    },
    `gatsby-plugin-twitter`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-remove-trailing-slashes`,
    { resolve: `gatsby-plugin-sitemap`, options: { exclude: ["/index2"] } },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: "GTM-T3L6RFK",
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: ["open sans:400", "roboto:400i,400"],
        display: "swap",
      },
    },
  ],
};
