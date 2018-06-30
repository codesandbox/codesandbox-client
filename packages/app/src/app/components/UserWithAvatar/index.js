import React from 'react';

import ContributorHelm from '../ContributorsBadge';
import PatronStar from '../PatronStar';
import { CenteredText, AuthorName, Image } from './elements';

function UserWithAvatar({ avatarUrl, username, subscriptionSince, ...props }) {
  return (
    <CenteredText {...props}>
      <Image src={avatarUrl} alt={username} />
      <AuthorName>
        {username}
        {subscriptionSince && (
          <PatronStar
            style={{ fontSize: '1.125em', marginBottom: '0.1em' }}
            subscriptionSince={subscriptionSince}
          />
        )}

        <ContributorHelm
          style={{ margin: '0 .5rem', fontSize: '1.25em' }}
          width={24}
          username={username}
        />
      </AuthorName>
    </CenteredText>
  );
}

export default UserWithAvatar;
