import * as React from 'react';
import { Dictionary } from '@cerebral/fluent';
import { Sandbox } from 'app/store/modules/profile/types';
import { connect } from 'app/fluent';

import Button from 'app/components/Button';
import SandboxList from 'app/components/SandboxList';

import { Navigation, Notice } from './elements';

const PER_PAGE_COUNT = 15;

export enum Source {
    currentSandboxes = 'currentSandboxes',
    currentLikedSandoxes = 'currentLikedSandboxes'
}

type Props = {
    source: Source;
    page: number;
    baseUrl: string;
};

export default connect<Props>()
    .with(({ state, signals, props }) => ({
        isLoadingSandboxes: state.profile.isLoadingSandboxes,
        sandboxes: state.profile[props.source] as Dictionary<Sandbox[]>,
        profile: state.profile.current,
        isProfileCurrentUser: state.profile.isProfileCurrentUser.get(),
        pageChanged:
            props.source === Source.currentSandboxes
                ? signals.profile.sandboxesPageChanged
                : signals.profile.likedSandboxesPageChanged,
        deleteSandboxClicked: signals.profile.deleteSandboxClicked
    }))
    .toClass(
        (props) =>
            class Sandboxes extends React.Component<typeof props> {
                static defaultProps = {
                    page: 1
                };

                fetch(force = false) {
                    const { pageChanged, page, isLoadingSandboxes, sandboxes } = this.props;

                    if (isLoadingSandboxes) {
                        return;
                    }

                    if (force || !sandboxes || !sandboxes.get(String(page))) {
                        pageChanged({ page });
                    }
                }

                componentDidMount() {
                    this.fetch();
                }

                componentDidUpdate(prevProps) {
                    if (prevProps.page !== this.props.page || prevProps.source !== this.props.source) {
                        this.fetch();
                    }
                }

                getLastPage = () => {
                    if (this.props.source === Source.currentSandboxes) {
                        const { sandboxCount } = this.props.profile;

                        return Math.ceil(sandboxCount / PER_PAGE_COUNT);
                    }

                    const { givenLikeCount } = this.props.profile;

                    return Math.ceil(givenLikeCount / PER_PAGE_COUNT);
                };

                deleteSandbox = (index) => {
                    this.props.deleteSandboxClicked({ index });
                };

                render() {
                    const { isLoadingSandboxes, isProfileCurrentUser, source, page, baseUrl, sandboxes } = this.props;

                    if (isLoadingSandboxes || !sandboxes || !sandboxes.get(String(page))) {
                        return <div />;
                    }

                    return (
                        <div>
                            {isProfileCurrentUser && (
                                <Notice>
                                    You{"'"}re viewing your own profile, so you can see your private and unlisted
                                    sandboxes. Others can{"'"}t.
                                </Notice>
                            )}
                            <SandboxList
                                isCurrentUser={isProfileCurrentUser}
                                sandboxes={sandboxes.get(String(page))}
                                onDelete={source === Source.currentSandboxes && this.deleteSandbox}
                            />
                            <Navigation>
                                <div>
                                    {page > 1 && (
                                        <Button style={{ margin: '0 0.5rem' }} small to={`${baseUrl}/${page - 1}`}>
                                            {'<'}
                                        </Button>
                                    )}
                                    {this.getLastPage() !== page && (
                                        <Button style={{ margin: '0 0.5rem' }} small to={`${baseUrl}/${page + 1}`}>
                                            {'>'}
                                        </Button>
                                    )}
                                </div>
                            </Navigation>
                        </div>
                    );
                }
            }
    );
