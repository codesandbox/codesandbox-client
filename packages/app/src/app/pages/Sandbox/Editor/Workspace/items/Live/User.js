import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import Switch from 'common/components/Switch';
import delay from 'common/utils/animation/delay-effect';

const Status = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

const ProfileImage = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 2px;
  border-left: 2px solid ${({ borderColor }) => borderColor};

  margin-right: 0.5rem;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
`;

const StyledSwitch = styled(Switch)`
  ${delay()};
`;

// eslint-disable-next-line
class User extends React.Component {
  render() {
    const { user, type, showSwitch, switchOn, roomInfo } = this.props;

    const metaData = roomInfo.usersMetadata.get(user.id);
    const [r, g, b] = metaData
      ? roomInfo.usersMetadata.get(user.id).color
      : [0, 0, 0];

    return (
      <UserContainer>
        <ProfileImage
          src={user.avatarUrl}
          alt={user.username}
          borderColor={`rgba(${r}, ${g}, ${b}, 0.7)`}
        />
        <div style={{ flex: 1 }}>
          <UserName>{user.username}</UserName>
          {type && <Status>{type}</Status>}
        </div>
        {showSwitch && (
          <div>
            <Switch offMode right={switchOn} small />
          </div>
        )}
      </UserContainer>
    );
  }
}

export default observer(User);
