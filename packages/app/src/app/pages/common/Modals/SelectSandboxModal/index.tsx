import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';
import Sandbox from './Sandbox';

import { Padding } from './elements';

type Props = WithCerebral;

const SelectSandboxModal: React.SFC<Props> = ({ store, signals }) => {
    if (store.profile.isLoadingSandboxes) {
        return <Padding>Loading sandboxes...</Padding>;
    }

    const showcasedSandbox = store.profile.showcasedSandbox.get();
    const currentShowcasedSandboxId = showcasedSandbox && showcasedSandbox.id;

    return (
        <div>
            {store.profile.userSandboxes
                .filter((x) => x)
                .map((sandbox) => (
                    <Sandbox
                        active={sandbox.id === currentShowcasedSandboxId}
                        key={sandbox.id}
                        sandbox={sandbox}
                        setShowcasedSandbox={(id) => signals.profile.newSandboxShowcaseSelected({ id })}
                    />
                ))}
        </div>
    );
};
export default connect<Props>()(SelectSandboxModal);
