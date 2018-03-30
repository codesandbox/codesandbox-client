import * as React from 'react';
import { connect } from 'app/fluent';

import Column from 'common/components/flex/Column';
import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';
import Button from 'app/components/Button';

import SandboxInfo from './SandboxInfo';
import ShowcasePreview from './ShowcasePreview';

import { ErrorTitle } from './elements';

export default connect()
    .with(({ state, signals }) => ({
        sandbox: state.profile.showcasedSandbox.get(),
        isCurrentUser: state.profile.isProfileCurrentUser.get(),
        isLoadingProfile: state.profile.isLoadingProfile,
        settings: state.preferences.settings,
        selectSandboxClicked: signals.profile.selectSandboxClicked
    }))
    .toClass(
        (props) =>
            class Showcase extends React.Component<typeof props> {
                openModal = () => {
                    this.props.selectSandboxClicked();
                };

                render() {
                    const { sandbox, isCurrentUser, isLoadingProfile, settings } = this.props;

                    if (isLoadingProfile) {
                        return (
                            <Centered vertical horizontal>
                                <Margin top={4}>
                                    <ErrorTitle>Loading showcased sandbox...</ErrorTitle>
                                </Margin>
                            </Centered>
                        );
                    }

                    if (!sandbox) {
                        return (
                            <Centered vertical horizontal>
                                <Margin top={4}>
                                    <ErrorTitle>This user doesn{"'"}t have a sandbox yet</ErrorTitle>
                                </Margin>
                            </Centered>
                        );
                    }

                    return (
                        <Column alignItems="center">
                            <Margin top={1}>
                                {isCurrentUser && (
                                    <Button small onClick={this.openModal}>
                                        Change Sandbox
                                    </Button>
                                )}
                            </Margin>
                            <Margin top={2} style={{ width: '100%' }}>
                                <Column alignItems="initial">
                                    <div style={{ flex: 2 }}>
                                        <ShowcasePreview sandbox={sandbox} settings={settings} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <SandboxInfo sandbox={sandbox} />
                                    </div>
                                </Column>
                            </Margin>
                        </Column>
                    );
                }
            }
    );
