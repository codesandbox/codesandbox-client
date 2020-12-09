import React, { useEffect } from 'react';
import { Button, Text, Element, Stack, Link } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import css from '@styled-system/css';
import format from 'date-fns/format';
import styled from 'styled-components';
import { listStyles } from 'homepage/src/pages/changelog/_elements';

import ReactMarkdown from 'react-markdown';

import { Header } from '../elements';

const Wrapper = styled(Element)`
  ${listStyles}
`;

export const New = ({
  goToTab,
  info,
  latestChangelog,
}: {
  goToTab: (event: any) => void;
  info: any;
  latestChangelog: string;
}) => {
  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: 'new' });
  }, []);

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
              {format(new Date(info.date.trim()), 'MMMM d yyyy')}
            </Text>
            <Text size={16} css={css({ lineHeight: '23px' })}>
              {info.description}
            </Text>
          </>
        ) : null}
        <Wrapper
          css={css({
            display: 'grid',
            gridTemplateColumns: '30% 1fr',
            gridGap: 6,
          })}
        >
          <ReactMarkdown
            renderers={{
              heading: props => {
                if (!props.children.length) return null;

                return React.createElement(
                  `h${props.level}`,
                  {},
                  props.children
                );
              },
            }}
            source={latestChangelog.split('---')[2]}
          />
        </Wrapper>
      </Element>
      <Stack
        justify="flex-end"
        paddingY={2}
        paddingRight={6}
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
