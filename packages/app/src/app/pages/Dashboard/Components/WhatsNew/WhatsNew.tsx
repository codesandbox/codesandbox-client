import React from 'react';
import css from '@styled-system/css';

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
import { useActions } from 'app/overmind';

export const WhatsNew = () => {
  const { modals: modalsActions } = useActions();

  return (
    <>
      <Element paddingBottom={80}>
        <Stack
          direction="horizontal"
          justify="space-between"
          css={css({ padding: '24px' })}
        >
          <Text variant="muted" size={13} css={css({ lineHeight: '16px' })}>
            What&apos;s new
          </Text>
          <IconButton
            name="cross"
            size={16}
            title="Close modal"
            onClick={() => modalsActions.whatsNew.close()}
          />
        </Stack>
      </Element>

      <Element paddingX={48} paddingBottom={56}>
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
            size={64}
            weight="500"
            css={css({
              margin: 0,
              fontFamily: 'Everett, sans-serif',
              lineHeight: '64px',
              letterSpacing: '-0.03em',
            })}
          >
            Introducing a unified CodeSandbox experience.
          </Text>
        </Stack>
      </Element>

      <Element paddingX={48} paddingBottom={56}>
        <Grid columnGap={5}>
          <Column span={3}>
            <Topic icon="repository">
              Projects is now <Text weight="700">Repositories</Text>: an
              improved git workflow powered by the cloud.
            </Topic>
          </Column>

          <Column span={3}>
            <Topic icon="dashboard">
              Supercharge your development workflow with our{' '}
              <Text weight="700">new dashboard</Text>.
            </Topic>
          </Column>

          <Column span={3}>
            <Topic icon="cloud">
              Go limitless with our{' '}
              <Text weight="700">Cloud Beta Sandboxes</Text>, powered by fast
              micro VMs.
            </Topic>
          </Column>

          <Column span={3}>
            <Topic icon="tagSelfClosing">
              Use our <Text weight="700">new editor</Text> or work right from VS
              Code or our iOS app.
            </Topic>
          </Column>
        </Grid>
      </Element>
    </>
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
