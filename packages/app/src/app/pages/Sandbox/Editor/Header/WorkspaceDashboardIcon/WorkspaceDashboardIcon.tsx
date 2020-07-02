import * as React from 'react';
import { useOvermind } from 'app/overmind';
import { Link } from 'react-router-dom';
import { Avatar, Icon } from '@codesandbox/components';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import { TeamAvatar } from 'app/components/TeamAvatar';

export const WorkspaceDashboardIcon = () => {
  const { state } = useOvermind();

  const user = state.user;

  return (
    <Link
      to={dashboard.home(state.activeTeam)}
      style={{
        position: 'relative',
        width: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      css={css({
        ':hover': {
          '#arrow-back': {
            opacity: 1,
          },
        },
      })}
    >
      <div
        id="arrow-back"
        style={{
          position: 'absolute',

          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 10,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        css={css({
          transition: '0.3s ease opacity',
          size: 6,
          opacity: 0,
        })}
      >
        <Icon style={{ color: 'white' }} name="backArrow" />
      </div>
      {state.activeTeam && state.activeTeamInfo ? (
        <TeamAvatar name={state.activeTeamInfo.name} />
      ) : (
        <Avatar css={css({ size: 6, borderRadius: 2 })} user={user} />
      )}
    </Link>
  );
};
