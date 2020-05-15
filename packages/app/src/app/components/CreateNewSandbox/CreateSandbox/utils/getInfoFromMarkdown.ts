import parse from 'remark-parse';
import stringify from 'remark-stringify';
import unified from 'unified';
import frontmatter from 'remark-frontmatter';

export const getInfoFromMarkdown = latestChangelog => {
  let desc = false;
  const rawMarkdown = unified()
    .use(parse)
    .use(stringify)
    .use(frontmatter, ['yaml'])
    .parse(latestChangelog);

  try {
    const infoData = rawMarkdown.children[0].value
      .split('\n')
      .reduce((acc, current) => {
        const [key, value] = current.split(':');

        if (desc) {
          acc.description += key;
        }

        if (key === 'description' && !value) {
          acc[key] = '';
          desc = true;
        } else {
          acc[key] = value.trim();
        }

        return acc;
      }, {});

    return infoData;
  } catch {
    return {};
  }
};
