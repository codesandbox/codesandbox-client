import Column from '@codesandbox/common/es/components/flex/Column';
import { PatronStar } from '@codesandbox/common/es/components/PatronStar';
import Margin from '@codesandbox/common/es/components/spacing/Margin';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { GitHubIcon, Name, ProfileImage, Row, Username } from './elements';

export const ProfileInfo: FunctionComponent = () => {
  const {
    state: {
      profile: {
        current: { avatarUrl, name, subscriptionSince, username },
      },
    },
  } = useOvermind();

  return (
    <Row>
      <ProfileImage alt={username} height={175} src={avatarUrl} width={175} />

      <Margin bottom={3}>
        <Column justifyContent="space-between">
          {name && <Name>{name}</Name>}

          <Username main={!name}>
            {username}
            <a
              href={`https://github.com/${username}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <GitHubIcon />
            </a>

            {subscriptionSince && (
              <PatronStar subscriptionSince={subscriptionSince} />
            )}
          </Username>
        </Column>
      </Margin>
    </Row>
  );
};
