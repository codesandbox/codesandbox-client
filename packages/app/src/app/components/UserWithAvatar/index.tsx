import * as React from 'react';

import PatronStar from '../PatronStar';
import { CenteredText, AuthorName, Image } from './elements';

export type Props = {
  avatarUrl: string
  username: string
  subscriptionSince?: string
}

const UserWithAvatar: React.SFC<Props> = ({ avatarUrl, username, subscriptionSince, ...props }) => {
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
