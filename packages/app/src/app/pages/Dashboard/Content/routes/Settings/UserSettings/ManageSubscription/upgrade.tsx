import React from 'react';

import styled from 'styled-components';
import css from '@styled-system/css';
import { Button, Stack, Text } from '@codesandbox/components';

import { Card } from '../../components';

const List = styled(Stack)`
  padding-left: 1em;
  margin: 0;

  ${Text} {
    list-style: disc;
    display: list-item;
  }
`;

export const Upgrade = () => {
  return (
    <Card
      as="a"
      href="/pro"
      css={{
        textDecoration: 'none',
        backgroundColor: 'white',
        borderTop: '6px solid #AC9CFF',
        padding: 24,
        borderRadius: 4,
      }}
    >
      <Stack direction="vertical" gap={4} css={css({ color: 'grays.800' })}>
        <Text size={6} weight="bold">
          Upgrade to Personal Pro
        </Text>
        <List direction="vertical" gap={1} as="ul">
          <Text as="li" size={3}>
            Advanced privacy settings
          </Text>
          <Text as="li" size={3}>
            More file storage
          </Text>
          <Text as="li" size={3}>
            Higher upload limits
          </Text>
          <Text as="li" size={3}>
            Flexible permissions
          </Text>
        </List>

        <Button type="button" marginTop={2} variant="secondary">
          Upgrade to Pro
        </Button>
      </Stack>
    </Card>
  );
};
