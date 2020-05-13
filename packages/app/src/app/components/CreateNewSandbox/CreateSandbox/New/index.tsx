import React, { useEffect, useState } from 'react';
import { Button, Text, Element, Stack, Link } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import changelog from 'homepage/content/changelog';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import unified from 'unified';
import frontmatter from 'remark-frontmatter';
import { Header } from '../elements';
import { ListWrapper } from './elements';

export const New = ({ goToTab }: { goToTab: (event: any) => void }) => {
  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: 'welcome' });
  }, []);
  const latestChangelog = changelog[changelog.length - 3];
  const [markdown, setMarkdown] = useState(null);

  // eslint-disable-next-line
  useEffect(() => {
    let desc = false;
    const rawMarkdown = unified()
      .use(parse)
      .use(stringify)
      .use(frontmatter, ['yaml'])
      .parse(latestChangelog);

    setMarkdown(() => ({
      content: rawMarkdown.children.slice(1),
      info: rawMarkdown.children[0].value.split('\n').reduce((acc, current) => {
        const [key, value] = current.split(':');

        if (desc) {
          acc.description += key;
        }

        if (key === 'description' && !value) {
          acc[key] = '';
          desc = true;
        } else {
          acc[key] = value;
        }

        return acc;
      }, {}),
    }));
  }, [latestChangelog]);

  return (
    <>
      <Header>
        <Text weight="normal">See what’s new</Text>
        <Link size={4} href="/changelog" variant="muted">
          Show all
        </Link>
      </Header>
      <Element padding={6} style={{ maxHeight: '100%', overflow: 'auto' }}>
        {markdown ? (
          <>
            <Text weight="bold" size={24} block paddingBottom={1}>
              {markdown.info.title}
            </Text>
            <Text variant="muted" block paddingBottom={3} size={3}>
              {markdown.info.date}
            </Text>
            <Element
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridGap: 24,
              }}
            >
              <Text size={16} style={{ lineHeight: '23px' }}>
                {markdown.info.description}
              </Text>
              <Element>
                {markdown.content.map(content => {
                  if (content.type === 'heading' && content.children.length) {
                    return (
                      <Text weight="bold" paddingBottom={2} block>
                        {content.children[0].value}
                      </Text>
                    );
                  }

                  if (content.type === 'paragraph' && content.children.length) {
                    return (
                      <Text style={{ lineHeight: 1.2 }} paddingBottom={6} block>
                        {content.children[0].value}
                      </Text>
                    );
                  }

                  if (content.type === 'list' && content.children.length) {
                    const List = content.ordered ? 'ol' : 'ul';
                    return (
                      <ListWrapper>
                        <List>
                          {content.children.map(
                            item =>
                              item.children[0].children[0].value && (
                                <li>{item.children[0].children[0].value}</li>
                              )
                          )}
                        </List>
                      </ListWrapper>
                    );
                  }
                })}
              </Element>
            </Element>
          </>
        ) : null}
      </Element>
      <Stack
        justify="flex-end"
        paddingY={2}
        paddingRight={6}
        marginTop={4}
        style={{ borderTop: '1px solid #242424' }}
      >
        <Button style={{ width: 'auto' }} onClick={goToTab}>
          Create Sandbox
        </Button>
      </Stack>
    </>
  );
};
