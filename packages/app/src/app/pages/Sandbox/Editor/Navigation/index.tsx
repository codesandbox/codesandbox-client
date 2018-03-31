import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import GitHubIcon from 'react-icons/lib/go/mark-github';
import LiveIcon from 'react-icons/lib/md/wifi-tethering';
import Tooltip from 'common/components/Tooltip';

import InfoIcon from './InfoIcon';
import FilesIcon from './FileIcon';
import RocketIcon from './RocketIcon';
import ConfigurationIcon from './ConfigurationIcon';

import { Container, IconContainer } from './elements';

const IDS_TO_ICONS = {
    project: InfoIcon,
    files: FilesIcon,
    github: GitHubIcon,
    deploy: RocketIcon,
    config: ConfigurationIcon,
    live: LiveIcon
};

type Props = WithCerebral;

const Navigation: React.SFC<Props> = ({ store, signals }) => (
    <Container>
        {store.workspace.items.get().filter((w) => typeof w.show === 'undefined' || w.show).map((item) => {
            const { id, name } = item;
            const Icon = IDS_TO_ICONS[id];
            const selected = id === store.workspace.openedWorkspaceItem;
            return (
                <Tooltip key={id} position="right" title={name}>
                    <IconContainer
                        selected={selected}
                        onClick={() => {
                            if (selected) {
                                signals.workspace.setWorkspaceItem({ item: null });
                            } else {
                                signals.workspace.setWorkspaceItem({ item: id });
                            }
                        }}
                    >
                        <Icon />
                    </IconContainer>
                </Tooltip>
            );
        })}
    </Container>
);

export default connect<Props>()(Navigation);
