export const makePost = ({ html, frontmatter }) => ({
  ...frontmatter,
  content: html,
  creator: frontmatter.authors[0],
  featuredImage: frontmatter.featuredImage.publicURL,
});

export const makeFeed = ({ edges: markdownPosts }) =>
  markdownPosts
    .map(({ node: { frontmatter, html } }) => ({
      ...frontmatter,
      content: html,
      creator: frontmatter.authors[0],
      date: new Date(frontmatter.date),
      src: frontmatter.featuredImage.publicURL,
      subtitle: frontmatter.description,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
