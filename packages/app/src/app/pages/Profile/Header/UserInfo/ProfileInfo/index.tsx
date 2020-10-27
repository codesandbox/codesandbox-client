import Column from '@codesandbox/common/lib/components/flex/Column';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { PatronStar } from '@codesandbox/common/lib/components/PatronStar';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { GitHubIcon, Name, ProfileImage, Row, Username } from './elements';

export const ProfileInfo: FunctionComponent = () => {
  const {
    state: {
      profile: {
        current: {
          avatarUrl,
          name,
          subscriptionSince,
          username,
          githubUsername,
        },
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
            {githubUsername ? (
              <a
                href={`https://github.com/${githubUsername}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <GitHubIcon />
              </a>
            ) : null}

            {subscriptionSince && (
              <PatronStar subscriptionSince={subscriptionSince} />
            )}
          </Username>
        </Column>
      </Margin>
    </Row>
  );
};
