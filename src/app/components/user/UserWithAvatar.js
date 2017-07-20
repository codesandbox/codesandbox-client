import React from 'react';
import styled from 'styled-components';

import Badge from 'app/utils/badges/Badge';

const CenteredText = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const AuthorName = styled.span`
  text-transform: uppercase;
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
  badge,
  ...props
}: Props) =>
  <CenteredText {...props}>
    <Image src={avatarUrl} alt={username} />
    <AuthorName>
      {username}
    </AuthorName>
    {subscriptionSince && badge && <Badge badge={badge} size={28} />}
  </CenteredText>;
