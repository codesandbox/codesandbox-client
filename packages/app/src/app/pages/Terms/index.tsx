import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'app/fluent';

import Navigation from 'app/pages/common/Navigation';
import Margin from 'common/components/spacing/Margin';
import MaxWidth from 'common/components/flex/MaxWidth';
import Centered from 'common/components/flex/Centered';
import { tosUrl, privacyUrl } from 'common/utils/url-generator';

import TOS from './TOS';
import PrivacyPolicy from './PrivacyPolicy';

import { Content, NavigationLink, LegalNavigation } from './elements';

export default connect()
    .with(({ signals }) => ({
        termsMounted: signals.termsMounted
    }))
    .toClass(
        (props) =>
            class Terms extends React.Component<typeof props> {
                componentDidMount() {
                    this.props.termsMounted();
                }
                render() {
                    return (
                        <MaxWidth>
                            <Margin margin={1.5}>
                                <Navigation title="Legal" />
                                <Content>
                                    <Centered horizontal>
                                        <MaxWidth width={1024}>
                                            <LegalNavigation>
                                                <NavigationLink
                                                    to={tosUrl()}
                                                    activeStyle={{
                                                        color: 'white'
                                                    }}
                                                >
                                                    TERMS AND CONDITIONS
                                                </NavigationLink>

                                                <NavigationLink
                                                    to={privacyUrl()}
                                                    activeStyle={{
                                                        color: 'white'
                                                    }}
                                                >
                                                    PRIVACY POLICY
                                                </NavigationLink>
                                            </LegalNavigation>

                                            <Switch>
                                                <Route path="/legal/terms" component={TOS} />
                                                <Route path="/legal/privacy" component={PrivacyPolicy} />
                                                <Redirect to="/legal/terms" />
                                            </Switch>
                                        </MaxWidth>
                                    </Centered>
                                </Content>
                            </Margin>
                        </MaxWidth>
                    );
                }
            }
    );
