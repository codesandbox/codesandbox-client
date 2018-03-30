import * as React from 'react';
import { connect } from 'app/fluent';
import Sandbox from './Sandbox';

import { Padding } from './elements';

export default connect()
    .with(({ state, signals }) => ({
        isLoadingSandboxes: state.profile.isLoadingSandboxes,
        currentShowcasedSandboxId: state.profile.showcasedSandbox.get() && state.profile.showcasedSandbox.get().id,
        userSandboxes: state.profile.userSandboxes,
        newSandboxShowcaseSelected: signals.profile.newSandboxShowcaseSelected
    }))
    .to(function SelectSandboxModal({
        isLoadingSandboxes,
        currentShowcasedSandboxId,
        userSandboxes,
        newSandboxShowcaseSelected
    }) {
        if (isLoadingSandboxes) {
            return <Padding>Loading sandboxes...</Padding>;
        }

        return (
            <div>
                {userSandboxes
                    .filter((x) => x)
                    .map((sandbox) => (
                        <Sandbox
                            active={sandbox.id === currentShowcasedSandboxId}
                            key={sandbox.id}
                            sandbox={sandbox}
                            setShowcasedSandbox={(id) => newSandboxShowcaseSelected({ id })}
                        />
                    ))}
            </div>
        );
    });
