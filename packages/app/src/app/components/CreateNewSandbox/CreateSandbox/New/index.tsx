import React, { useEffect, useState } from 'react';
import { Button, Text, Element, Stack, Link } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import css from '@styled-system/css';
import format from 'date-fns/format';
import styled from 'styled-components';
import { listStyles } from 'homepage/src/pages/changelog/_elements';
import changelog from 'homepage/content/changelog';
import ReactMarkdown from 'react-markdown';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import unified from 'unified';
import frontmatter from 'remark-frontmatter';
import { Header } from '../elements';

const Wrapper = styled(Element)`
  ${listStyles}
`;

export const New = ({
  goToTab,
  getVersion,
}: {
  goToTab: (event: any) => void;
  getVersion: (title: string) => void;
}) => {
  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: 'new' });
  }, []);

  const latestChangelog = changelog[changelog.length - 1];
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let desc = false;
    const rawMarkdown = unified()
      .use(parse)
      .use(stringify)
      .use(frontmatter, ['yaml'])
      .parse(latestChangelog);

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
          acc[key] = value;
        }

        return acc;
      }, {});

    setInfo(infoData);
    getVersion(infoData.title);
  }, [getVersion, latestChangelog]);

  return (
    <>
      <Header>
        <Text weight="normal">See what’s new</Text>
        <Link size={4} href="/changelog" variant="muted">
          Show all
        </Link>
      </Header>

      <Element padding={6} css={css({ maxHeight: '100%', overflow: 'auto' })}>
        {info ? (
          <>
            <Text weight="bold" size={24} block paddingBottom={1}>
              {info.title}
            </Text>
            <Text variant="muted" block paddingBottom={3} size={3}>
              {format(new Date(info.date), 'MMMM d yyyy')}
            </Text>
            <Text size={16} css={css({ lineHeight: '23px' })}>
              {info.description}
            </Text>
          </>
        ) : null}
        <Wrapper
          css={css({
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: 6,
          })}
        >
          <ReactMarkdown source={latestChangelog.split('---')[2]} />
        </Wrapper>
      </Element>
      <Stack
        justify="flex-end"
        paddingY={2}
        paddingRight={6}
        marginTop={4}
        css={css({
          borderTop: '1px solid transparent',
          borderTopColor: 'grays.600',
        })}
      >
        <Button css={css({ width: 'auto' })} onClick={goToTab}>
          Create Sandbox
        </Button>
      </Stack>
    </>
  );
};
