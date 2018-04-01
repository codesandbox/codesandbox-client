import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { inject } from 'mobx-react';

import Navigation from 'app/pages/common/Navigation';
import Margin from 'common/components/spacing/Margin';
import MaxWidth from 'common/components/flex/MaxWidth';
import Centered from 'common/components/flex/Centered';
import { tosUrl, privacyUrl } from 'common/utils/url-generator';

import TOS from './TOS';
import PrivacyPolicy from './PrivacyPolicy';

import { Content, NavigationLink, LegalNavigation } from './elements';

class Terms extends React.Component {
  componentDidMount() {
    this.props.signals.termsMounted();
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
                      color: 'white',
                    }}
                  >
                    TERMS AND CONDITIONS
                  </NavigationLink>

                  <NavigationLink
                    to={privacyUrl()}
                    activeStyle={{
                      color: 'white',
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

export default inject('signals')(Terms);
