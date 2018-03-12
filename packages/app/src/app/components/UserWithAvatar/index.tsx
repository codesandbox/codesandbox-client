import React from 'react';

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
      </AuthorName>
    </CenteredText>
  );
}

export default UserWithAvatar;
