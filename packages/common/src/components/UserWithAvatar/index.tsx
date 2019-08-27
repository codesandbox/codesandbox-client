import React from 'react';

import ContributorHelm from '../ContributorsBadge';
import { PatronStar } from '../PatronStar';
import { CenteredText, AuthorName, Image, Names, Username } from './elements';

export interface UserWithAvatarProps {
  avatarUrl: string;
  username: string;
  name?: string;
  hideBadge?: boolean;
  subscriptionSince?: number | Date;
  useBigName?: boolean;
}

export function UserWithAvatar({
  avatarUrl,
  username,
  name,
  hideBadge,
  subscriptionSince,
  useBigName,
  ...props
}: UserWithAvatarProps) {
  return (
    <CenteredText {...props}>
      {avatarUrl && <Image src={avatarUrl} alt={username} />}
      <AuthorName useBigName={useBigName}>
        <Names>
          {name && <div>{name}</div>}
          {username && (
            <Username hasTwoNames={name && Boolean(username)}>
              {username}
            </Username>
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
            username={username}
          />
        )}
      </AuthorName>
    </CenteredText>
  );
}
