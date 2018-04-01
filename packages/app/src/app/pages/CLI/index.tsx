import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import Navigation from 'app/pages/common/Navigation';

import Prompt from './Prompt';
import { Container } from './elements';

class CLI extends React.Component<WithCerebral> {
    componentDidMount() {
        this.props.signals.cliMounted();
    }

    render() {
        const { user, authToken, isLoadingCLI, error } = this.props.store;

        return (
            <Container>
                <Navigation title="CLI Authorization" />
                <Prompt
                    error={error}
                    token={authToken}
                    loading={isLoadingCLI}
                    username={user && user.username}
                    signIn={this.props.signals.signInCliClicked}
                />
            </Container>
        );
    }
}

export default connect()(CLI);
