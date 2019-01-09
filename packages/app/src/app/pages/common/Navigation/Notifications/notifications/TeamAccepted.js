import React from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';

import { NotificationContainer, NotificationImage as Image } from '../elements';

const Container = styled(NotificationContainer)`
  display: flex;
`;

const W = styled.span`
  color: white;
`;

const TeamInvite = ({ read, teamName, userName, userAvatar }) => (
  <div>
    <Container success read={read}>
      <Image src={userAvatar} />
      <div>
        <W>{userName}</W> accepted your invitation to join <W>{teamName}!</W>
      </div>
    </Container>
  </div>
);
export default inject('signals')(TeamInvite);
