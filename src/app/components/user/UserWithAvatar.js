import React from 'react';
import styled from 'styled-components';

const CenteredText = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const AuthorName = styled.span`
  text-transform: uppercase;
  margin: 0 0.5em;
  margin-right: 1em;
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
};

export default ({ avatarUrl, username }: Props) =>
  <CenteredText>
    <Image src={avatarUrl} alt={username} />
    <AuthorName>
      {username}
    </AuthorName>
  </CenteredText>;
