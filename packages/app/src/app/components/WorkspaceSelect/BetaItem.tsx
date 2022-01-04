import React from 'react';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { Text, Menu, Stack, Icon } from '@codesandbox/components';
import css from '@styled-system/css';
import { useHistory } from 'react-router-dom';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';

import { MenuItem, BetaBadge } from './elements';

export const BetaActiveItem: React.FC = () => (
  <Stack gap={2} as="span" align="center">
    <Stack as="span" align="center" justify="center">
      <TeamAvatar
        avatar={undefined}
        name="Beta"
        size="small"
        css={{ backgroundColor: '#3dc9b0' }}
      />
    </Stack>
    <Text size={4} weight="normal" maxWidth={140}>
      CodeSandbox V2
    </Text>
  </Stack>
);

export const BetaMenuItem: React.FC = () => {
  const history = useHistory();

  return (
    <MenuItem
      as={Menu.Item}
      align="center"
      gap={2}
      onSelect={() => history.push(dashboardUrls.beta())}
    >
      <TeamAvatar
        avatar={undefined}
        name="Beta"
        size="small"
        css={{ backgroundColor: '#3dc9b0' }}
      />
      <Stack align="center">
        <Text css={css({ width: '100%' })} size={3}>
          CodeSandbox V2
        </Text>

        <BetaBadge>Beta</BetaBadge>
      </Stack>

      {history.location.pathname === dashboardUrls.beta() && (
        <Icon name="simpleCheck" />
      )}
    </MenuItem>
  );
};
