import * as React from 'react';
import { sortBy } from 'lodash';
import { observer } from 'mobx-react';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import Margin from 'common/components/spacing/Margin';
import User from '../User';
import Countdown from '../Countdown';
import { Description } from '../../../elements';
import { RoomInfo } from 'app/store/modules/live/types';
import {
    Container,
    Title,
    StyledInput,
    SubTitle,
    Users,
    ModeSelect,
    Mode,
    ModeDetails,
    ModeSelector
} from './elements';

type Props = {
    roomInfo: RoomInfo;
    isOwner: boolean;
    ownerId: string;
    currentUserId: string;
    reconnecting: boolean;
    setMode: (payload: { mode: string }) => void;
    addEditor: (payload: { userId: string }) => void;
    removeEditor: (payload: { userId: string }) => void;
};

class LiveInfo extends React.PureComponent<Props> {
    select = (e) => {
        e.target.select();
    };

    render() {
        const {
            roomInfo,
            isOwner,
            ownerId,
            setMode,
            addEditor,
            removeEditor,
            currentUserId,
            reconnecting
        } = this.props;

        const owner = roomInfo.users.find((u) => u.id === ownerId);

        const editors = sortBy(
            roomInfo.users.filter((u) => roomInfo.editorIds.indexOf(u.id) > -1 && u.id !== ownerId),
            'username'
        );
        const otherUsers = sortBy(
            roomInfo.users.filter((u) => u.id !== ownerId && roomInfo.editorIds.indexOf(u.id) === -1),
            'username'
        );

        return (
            <Container>
                <Title>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        {reconnecting ? (
                            'Reconnecting...'
                        ) : (
                            <React.Fragment>
                                <RecordIcon /> {isOwner ? "You've gone live!" : 'You are live!'}
                            </React.Fragment>
                        )}
                    </div>
                    <div>{roomInfo.startTime != null && <Countdown time={roomInfo.startTime} />}</div>
                </Title>
                <Description>Share this link with others to invite them to the session:</Description>
                <StyledInput onFocus={this.select} value={`https://codesandbox.io/live/${roomInfo.roomId}`} />

                <Margin top={1}>
                    <SubTitle>Live Mode</SubTitle>
                    <ModeSelect>
                        <ModeSelector i={roomInfo.mode === 'open' ? 0 : 1} />
                        <Mode
                            onClick={isOwner ? () => setMode({ mode: 'open' }) : undefined}
                            selected={roomInfo.mode === 'open'}
                        >
                            <div>Open</div>
                            <ModeDetails>Everyone can edit</ModeDetails>
                        </Mode>
                        <Mode
                            onClick={isOwner ? () => setMode({ mode: 'classroom' }) : undefined}
                            selected={roomInfo.mode === 'classroom'}
                        >
                            <div>Classroom</div>
                            <ModeDetails>Take control over who can edit</ModeDetails>
                        </Mode>
                    </ModeSelect>
                </Margin>

                {owner && (
                    <Margin top={1}>
                        <SubTitle>Owner</SubTitle>
                        <Users>
                            <User currentUserId={currentUserId} user={owner} roomInfo={roomInfo} type="Owner" />
                        </Users>
                    </Margin>
                )}

                {editors.length > 0 &&
                roomInfo.mode === 'classroom' && (
                    <Margin top={1}>
                        <SubTitle>Editors</SubTitle>
                        <Users>
                            {editors.map((user) => (
                                <User
                                    currentUserId={currentUserId}
                                    key={user.id}
                                    showSwitch={isOwner && roomInfo.mode === 'classroom'}
                                    user={user}
                                    roomInfo={roomInfo}
                                    onClick={() => removeEditor({ userId: user.id })}
                                    type="Editor"
                                />
                            ))}
                        </Users>
                    </Margin>
                )}

                <Margin top={1}>
                    <SubTitle>Users</SubTitle>

                    <Users>
                        {otherUsers.length ? (
                            otherUsers.map((user) => (
                                <User
                                    currentUserId={currentUserId}
                                    key={user.id}
                                    showSwitch={isOwner && roomInfo.mode === 'classroom'}
                                    user={user}
                                    roomInfo={roomInfo}
                                    onClick={() => addEditor({ userId: user.id })}
                                    type="Spectator"
                                    showPlusIcon
                                />
                            ))
                        ) : (
                            <div
                                style={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontWeight: 600,
                                    fontSize: '.875rem',
                                    marginTop: '0.25rem'
                                }}
                            >
                                No other users in session, invite them!
                            </div>
                        )}
                    </Users>
                </Margin>
            </Container>
        );
    }
}

export default observer(LiveInfo);
