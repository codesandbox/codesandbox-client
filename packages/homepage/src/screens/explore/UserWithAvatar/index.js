import React from 'react';

import { AuthorName, CenteredText, Image, Names, Username } from './elements';

export const UserWithAvatar = ({
  avatarUrl,
  username,
  name,
  hideBadge,
  subscriptionSince,
  useBigName,
  ...props
}) => (
  <CenteredText {...props}>
    {avatarUrl && <Image src={avatarUrl} alt={username} />}

    <AuthorName useBigName={useBigName}>
      <Names>
        {name && <div>{name}</div>}

        {username && (
          <Username hasTwoNames={Boolean(name && username)}>
            {username}
          </Username>
        )}
      </Names>
    </AuthorName>
  </CenteredText>
);
