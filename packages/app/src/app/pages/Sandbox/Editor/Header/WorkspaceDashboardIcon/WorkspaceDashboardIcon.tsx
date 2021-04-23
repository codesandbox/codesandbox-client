import * as React from 'react';
import { useAppState } from 'app/overmind';
import { Link } from 'react-router-dom';
import { Avatar, Icon, Tooltip, Stack } from '@codesandbox/components';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import { TeamAvatar } from 'app/components/TeamAvatar';

export const WorkspaceDashboardIcon = () => {
  const { user, activeTeam, activeTeamInfo } = useAppState();

  return (
    <Tooltip label="To Dashboard">
      <Link
        to={dashboard.home(activeTeam)}
        style={{
          position: 'relative',
          width: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
        }}
        css={css({
          ':hover': {
            '#arrow-back': {
              opacity: 1,
            },
          },
        })}
      >
        <Stack
          id="arrow-back"
          justify="center"
          align="center"
          css={css({
            opacity: 0,
            backgroundColor: 'secondaryButton.background',
            transition: '0.15s ease opacity',
            size: '26px',
            position: 'absolute',
            zIndex: 10,
            borderRadius: 'small',
          })}
        >
          <Icon style={{ color: 'white' }} name="backArrow" />
        </Stack>
        {activeTeam && activeTeamInfo ? (
          <TeamAvatar
            avatar={activeTeamInfo.avatarUrl}
            name={activeTeamInfo.name}
          />
        ) : (
          <Avatar css={css({ size: '26px', borderRadius: 2 })} user={user} />
        )}
      </Link>
    </Tooltip>
  );
};
