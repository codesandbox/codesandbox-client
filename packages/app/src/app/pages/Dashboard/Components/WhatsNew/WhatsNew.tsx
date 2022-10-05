import React from 'react';
import css from '@styled-system/css';
import Media from 'react-media';

import {
  Text,
  Stack,
  Element,
  Grid,
  Column,
  Icon,
  Link,
  IconButton,
} from '@codesandbox/components';

interface WhatsNewProps {
  onClose: () => void;
}

export const WhatsNew = ({ onClose }: WhatsNewProps) => {
  return (
    <Media query="(max-width: 549px)">
      {matchSmall => (
        <Media query="(min-width: 550px) and (max-width: 689px)">
          {matchMedium => (
            <>
              <Element paddingBottom={matchSmall ? 20 : 56}>
                <Stack
                  direction="horizontal"
                  justify="flex-end"
                  css={css({ padding: '24px' })}
                >
                  <IconButton
                    name="cross"
                    size={16}
                    title="Close modal"
                    onClick={onClose}
                  />
                </Stack>
              </Element>

              <Element
                paddingX={matchSmall ? 24 : 48}
                paddingBottom={matchSmall ? 44 : 56}
              >
                <Stack direction="vertical" gap={6}>
                  <Text
                    size={12}
                    weight="500"
                    css={css({
                      lineHeight: '20px',
                      alignSelf: 'flex-start',
                      backgroundColor: '#EDFFA5',
                      color: '#0E0E0E',
                      padding: '0px 6px',
                      borderRadius: '3px',
                    })}
                  >
                    New
                  </Text>
                  <Text
                    as="h2"
                    size={matchSmall ? 44 : 64}
                    weight="500"
                    css={css({
                      margin: 0,
                      fontFamily: 'Everett, sans-serif',
                      lineHeight: matchSmall ? '44px' : '64px',
                      letterSpacing: '-0.03em',
                    })}
                  >
                    Introducing a unified CodeSandbox experience.
                  </Text>
                </Stack>
              </Element>

              <Element
                paddingX={matchSmall ? 24 : 48}
                paddingBottom={matchSmall ? 44 : 56}
              >
                <Grid columnGap={5}>
                  <Column span={matchSmall || matchMedium ? 6 : 3}>
                    <Topic icon="repository">
                      Projects is now <Text weight="700">Repositories</Text>: an
                      improved git workflow powered by the cloud.
                    </Topic>
                  </Column>

                  <Column span={matchSmall || matchMedium ? 6 : 3}>
                    <Topic icon="grid">
                      Supercharge your development workflow with our{' '}
                      <Text weight="700">new dashboard</Text>.
                    </Topic>
                  </Column>

                  <Column span={matchSmall || matchMedium ? 6 : 3}>
                    <Topic icon="cloud">
                      Go limitless with our{' '}
                      <Text weight="700">Cloud Beta Sandboxes</Text>, powered by
                      fast micro VMs.
                    </Topic>
                  </Column>

                  <Column span={matchSmall || matchMedium ? 6 : 3}>
                    <Topic icon="tagSelfClosing">
                      Use our <Text weight="700">new editor</Text>, work
                      straight from VS Code or through our native iOS app.
                    </Topic>
                  </Column>
                </Grid>
              </Element>
            </>
          )}
        </Media>
      )}
    </Media>
  );
};

interface TopicProps {
  children: React.ReactNode[];
  icon: React.ComponentProps<typeof Icon>['name'];
  // ❗️ TODO: Link
  linkTo?: string;
}

const Topic = ({ children, icon, linkTo }: TopicProps) => (
  <>
    <Element paddingY={4}>
      <Icon color="#EDFFA5" name={icon} />
    </Element>
    <Stack direction="vertical" gap={2}>
      <Text weight="400" size={13} css={css({ lineHeight: '16px' })}>
        {children}
      </Text>
      {/* ❗️ TODO: Link to the right page */}
      <Link variant="muted" size={12} css={css({ lineHeight: '16px' })}>
        Learn more
      </Link>
    </Stack>
  </>
);
