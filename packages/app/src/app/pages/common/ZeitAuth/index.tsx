import * as React from 'react';

import Centered from 'common/components/flex/Centered';
import Title from 'app/components/Title';

import { protocolAndHost, signInUrl, newSandboxUrl } from 'common/utils/url-generator';

type State = {
    code?: string;
    redirect?: string;
    error?: string;
    jwt?: string;
};

export default class ZeitSignIn extends React.PureComponent<{}, State> {
    state: State;
    constructor(props) {
        super(props);

        const searchMatch = document.location.search.match(/\?code=(.*)/);
        const code = searchMatch && searchMatch[1];

        if (code) {
            if (window.opener) {
                this.state = {
                    code
                };
                if (window.opener.location.origin === window.location.origin) {
                    window.opener.postMessage(
                        {
                            type: 'signin',
                            data: {
                                code
                            }
                        },
                        protocolAndHost()
                    );
                }
                return;
            }
            this.state = {
                redirect: '/'
            };
            return;
        }

        this.state = {
            error: 'no message received'
        };
    }

    getMessage = () => {
        if (this.state.redirect) {
            document.location.href = newSandboxUrl();
            return 'Redirecting to sandbox page';
        }
        if (this.state.error) {
            return `Something went wrong while signing in: ${this.state.error}`;
        }
        if (this.state.jwt) {
            return 'Signing in...';
        }
        if (this.state.jwt == null) {
            setTimeout(() => {
                document.location.href = signInUrl();
            }, 2000);
            return 'Redirecting to sign in page...';
        }

        return 'Hey';
    };

    render() {
        return (
            <Centered horizontal vertical>
                <Title>{this.getMessage()}</Title>
            </Centered>
        );
    }
}
