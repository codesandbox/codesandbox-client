import * as React from 'react';
import { observer } from 'mobx-react';
import Tooltip from 'common/components/Tooltip';
import AddIcon from 'react-icons/lib/md/add';
import RemoveIcon from 'react-icons/lib/md/remove';

import { RoomInfo, LiveUser } from 'app/store/modules/live/types';

import { Status, UserContainer, ProfileImage, UserName, IconContainer } from './elements';

type Props = {
    user: LiveUser;
    type: string;
    showPlusIcon?: boolean;
    showSwitch?: boolean;
    roomInfo: RoomInfo;
    currentUserId: string;
    onClick?: () => void;
};

class User extends React.Component<Props> {
    render() {
        const { user, type, onClick, showPlusIcon, showSwitch, roomInfo, currentUserId } = this.props;

        const metaData = roomInfo.usersMetadata.get(user.id);
        const [ r, g, b ] = metaData ? roomInfo.usersMetadata.get(user.id).color : [ 0, 0, 0 ];

        const isCurrentUser = user.id === currentUserId;

        return (
            <UserContainer isCurrentUser={isCurrentUser}>
                <ProfileImage src={user.avatarUrl} alt={user.username} borderColor={`rgba(${r}, ${g}, ${b}, 0.7)`} />
                <div style={{ flex: 1 }}>
                    <UserName>{user.username}</UserName>
                    {type && (
                        <Status>
                            {type}
                            {isCurrentUser && ' (you)'}
                        </Status>
                    )}
                </div>
                {showSwitch && (
                    <IconContainer>
                        <Tooltip title={showPlusIcon ? 'Make editor' : 'Make spectator'}>
                            {showPlusIcon ? <AddIcon onClick={onClick} /> : <RemoveIcon onClick={onClick} />}
                        </Tooltip>
                    </IconContainer>
                )}
            </UserContainer>
        );
    }
}

export default observer(User);
