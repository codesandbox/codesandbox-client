import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import HeartIcon from 'react-icons/lib/fa/heart-o';
import FullHeartIcon from 'react-icons/lib/fa/heart';
import Tooltip from 'common/components/Tooltip';

import { Container } from './elements';

import { Sandbox } from 'app/store/modules/editor/types';

const MaybeTooltip = ({ loggedIn, ...props }) => (loggedIn ? <Tooltip {...props} /> : <div {...props} />);

type ExternalProps = {
    sandbox: Sandbox;
    className?: string;
    colorless?: boolean;
};

type Props = ExternalProps & WithCerebral;

const LikeHeart: React.SFC<Props> = ({ sandbox, store, signals, className, colorless }) => {
    return (
        <Container loggedIn={store.isLoggedIn} className={className}>
            <MaybeTooltip loggedIn={store.isLoggedIn} title={sandbox.userLiked ? 'Undo like' : 'Like'}>
                {sandbox.userLiked ? (
                    <FullHeartIcon
                        style={colorless ? null : { color: '#E01F4E' }}
                        onClick={store.isLoggedIn ? () => signals.editor.likeSandboxToggled({ id: sandbox.id }) : null}
                    />
                ) : (
                    <HeartIcon
                        onClick={store.isLoggedIn ? () => signals.editor.likeSandboxToggled({ id: sandbox.id }) : null}
                    />
                )}
            </MaybeTooltip>
        </Container>
    );
};

export default connect<ExternalProps>()(LikeHeart);
