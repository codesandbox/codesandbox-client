import React from 'react';

import Row from 'common/components/flex/Row';
import Column from 'common/components/flex/Column';

import Margin from 'common/components/spacing/Margin';
import PatronStar from 'app/components/PatronStar';

import { ProfileImage, Name, Username, IconWrapper } from './elements';

function ProfileInfo({ username, subscriptionSince, name, avatarUrl }) {
  return (
    <Row
      css={`
        flex: 1;
      `}
    >
      <ProfileImage alt={username} height={175} width={175} src={avatarUrl} />
      <Margin bottom={3}>
        <Column justifyContent="space-between">
          {name && (
            <Name>
              {name}
              {subscriptionSince && (
                <PatronStar subscriptionSince={subscriptionSince} />
              )}
            </Name>
          )}
          <Username main={!name}>
            {username}
            <a
              href={`https://github.com/${username}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <IconWrapper />
            </a>
          </Username>
        </Column>
      </Margin>
    </Row>
  );
}

export default ProfileInfo;
