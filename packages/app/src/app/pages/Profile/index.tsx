import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';

import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import { profileSandboxesUrl, profileLikesUrl } from 'common/utils/url-generator';

import NotFound from 'app/pages/common/NotFound';

import Header from './Header';
import Navigation from './Navigation';
import Showcase from './Showcase';
import Sandboxes from './Sandboxes';

import { Container, Content } from './elements';

type ExternalProps = RouteComponentProps<{
    username: string;
}>;

type Props = ExternalProps & WithCerebral;

class Profile extends React.Component<Props> {
    componentDidMount() {
        const { username } = this.props.match.params;

        this.props.signals.profile.profileMounted({ username });
    }

    componentDidUpdate(prevProps) {
        const prevUsername = prevProps.match.params.username;
        const username = this.props.match.params.username;

        if (prevUsername !== username) {
            this.props.signals.profile.profileMounted({ username });
        }
    }

    render() {
        const { store, match } = this.props;

        if (store.profile.notFound) {
            return <NotFound />;
        }

        if (!store.profile.current) {
            return <div />;
        }

        const user = store.profile.current;

        document.title = `${user.name || user.username} - CodeSandbox`;
        return (
            <Container>
                <Header user={user} />
                <Content>
                    <MaxWidth>
                        <Navigation
                            username={user.username}
                            sandboxCount={user.sandboxCount}
                            likeCount={user.givenLikeCount}
                        />
                    </MaxWidth>
                </Content>
                <MaxWidth width={1024}>
                    <Margin horizontal={2} style={{ minHeight: '60vh' }}>
                        <Switch>
                            <Route path={match.url} exact render={() => <Showcase />} />
                            <Route
                                path={`${profileSandboxesUrl(user.username)}/:page?`}
                                // eslint-disable-next-line
                                children={(childrenProps) => (
                                    <Sandboxes
                                        source="currentSandboxes"
                                        page={childrenProps.match.params.page && +childrenProps.match.params.page}
                                        baseUrl={profileSandboxesUrl(user.username)}
                                    />
                                )}
                            />
                            <Route
                                path={`${profileLikesUrl(user.username)}/:page?`}
                                // eslint-disable-next-line
                                children={(childrenProps) => (
                                    <Sandboxes
                                        source="currentLikedSandboxes"
                                        page={childrenProps.match.params.page && +childrenProps.match.params.page}
                                        baseUrl={profileLikesUrl(user.username)}
                                    />
                                )}
                            />
                        </Switch>
                    </Margin>
                </MaxWidth>
            </Container>
        );
    }
}

export default connect<ExternalProps>()(Profile);
