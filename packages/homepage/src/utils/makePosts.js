// Im so sorry about this whole file

const ives = 'https://avatars2.githubusercontent.com/u/587016?s=60&v=4';
export const makePost = (markdown, medium) => {
  if (medium) {
    return {
      ...medium,
      photo: ives,
      content: medium.content.encoded,
      date: medium.isoDate,
    };
  }

  return {
    ...markdown.frontmatter,
    content: markdown.html,
    creator: markdown.frontmatter.authors[0],
  };
};

const getContents = str => {
  if (typeof document !== 'undefined') {
    const elem = document.createElement('div');
    elem.style.display = 'none';
    document.body.appendChild(elem);
    elem.innerHTML = str;
    const data = {
      src: elem.querySelector('img').src,
      subtitle: elem.querySelector('p').innerText,
    };
    elem.remove();
    return data;
  }
  return {
    src: '',
    subtitle: '',
  };
};

export const makeFeed = (mediumPosts, markdownPosts) => {
  let markdown = [];
  const medium = mediumPosts.edges
    .filter(post => post.node.categories)
    .map(post => {
      const { src, subtitle } = getContents(post.node.content.encoded);
      return {
        ...post.node,
        photo: ives,
        slug: post.node.title
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-'),
        src,
        subtitle,
        date: new Date(post.node.isoDate),
      };
    });
  if (markdownPosts) {
    markdown = markdownPosts.edges.map(post => ({
      ...post.node.frontmatter,
      src: post.node.frontmatter.featuredImage,
      subtitle: post.node.frontmatter.description,
      content: post.node.html,
      date: new Date(post.node.frontmatter.date),
      creator: post.node.frontmatter.authors[0],
    }));
  }
  return [...medium, ...markdown].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
};
