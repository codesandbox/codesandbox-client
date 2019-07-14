import React from 'react';

import { NotificationImage as Image } from '../elements';
import { Container, W } from './elements';

interface Props {
  read: boolean;
  teamName: string;
  userName: string;
  userAvatar: string;
}

const TeamInvite = ({ read, teamName, userName, userAvatar }: Props) => (
  <div>
    <Container success read={read}>
      <Image src={userAvatar} />
      <div>
        <W>{userName}</W> accepted your invitation to join <W>{teamName}!</W>
      </div>
    </Container>
  </div>
);

export default TeamInvite;
