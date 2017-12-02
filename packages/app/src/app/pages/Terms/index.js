import React from 'react';
import styled from 'styled-components';

import { NavLink, Switch, Route, Redirect } from 'react-router-dom';

import Navigation from 'app/containers/Navigation';
import Margin from 'common/components/spacing/Margin';
import MaxWidth from 'common/components/flex/MaxWidth';
import Centered from 'common/components/flex/Centered';
import { tosUrl, privacyUrl } from 'common/utils/url-generator';

import TOS from './TOS';
import PrivacyPolicy from './PrivacyPolicy';

const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: rgba(255, 255, 255, 0.7);

  h1 {
    color: rgba(255, 255, 255, 0.9);
  }

  h2 {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const NavigationLink = styled(NavLink)`
  transition: 0.3s ease all;

  display: block;
  color: white;
  padding: 0rem 4rem;
  margin: 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 300;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.5);

  &:hover {
    color: white;
  }
`;

const LegalNavigtion = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  font-size: 1.25rem;
  color: white;
  width: 100%;
  margin-bottom: 3rem;
`;

export default () => (
  <MaxWidth>
    <Margin margin={1.5}>
      <Navigation title="Legal" />
      <Content>
        <Centered horizontal>
          <MaxWidth width={1024}>
            <LegalNavigtion>
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
            </LegalNavigtion>

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
