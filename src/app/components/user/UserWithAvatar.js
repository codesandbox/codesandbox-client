import React from 'react';
import styled from 'styled-components';

import PatronStar from './PatronStar';

const CenteredText = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const AuthorName = styled.span`
  display: inline-flex;
  align-items: center;
  margin: 0 0.5em;
  font-weight: 400;
`;

const Image = styled.img`
  width: 1.75em;
  height: 1.75em;
  border-radius: 4px;
`;

type Props = {
  avatarUrl: string,
  username: string,
  subscriptionSince: ?string,
  badge: ?Object,
};

export default ({
  avatarUrl,
  username,
  subscriptionSince,
  ...props
}: Props) => (
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
