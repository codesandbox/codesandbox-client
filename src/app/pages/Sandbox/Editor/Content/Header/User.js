import React from 'react';
import styled from 'styled-components';
import type { User } from 'app/store/user/reducer';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  line-height: 3rem;
  vertical-align: middle;
  font-size: 1rem;
`;

const Image = styled.img`
  margin-bottom: -14px;
  margin-right: 0.5rem;
`;

export default ({ user }: { user: User }) => (
  <Container>
    {user.id
      ? <span>
          <Image
            style={{ borderRadius: '4px' }}
            height="38"
            src={user.avatarUrl}
          />
          {user.username}
        </span>
      : <span>Logging in...</span>}
  </Container>
);
