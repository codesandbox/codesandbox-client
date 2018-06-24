import React from 'react';

import ContributorHelm from '../ContributorsBadge';
import PatronStar from '../PatronStar';
import { CenteredText, AuthorName, Image, Names, Username } from './elements';

function UserWithAvatar({
  avatarUrl,
  username,
  name,
  hideBadge,
  subscriptionSince,
  useBigName,
  ...props
}) {
  return (
    <CenteredText {...props}>
      {avatarUrl && <Image src={avatarUrl} alt={username} />}
      <AuthorName useBigName={useBigName}>
        <Names>
          {name && <div>{name}</div>}
          {username && (
            <Username hasTwoNames={name && username}>{username}</Username>
          )}
        </Names>
        {subscriptionSince && (
          <PatronStar
            style={{ fontSize: '1.125em', marginBottom: '0.1em' }}
            subscriptionSince={subscriptionSince}
          />
        )}
        {!hideBadge && (
          <ContributorHelm
            style={{ margin: '0 .5rem', fontSize: '1.25em' }}
            width={24}
            username={username}
          />
        )}
      </AuthorName>
    </CenteredText>
  );
}

export default UserWithAvatar;
