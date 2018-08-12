// @ts-check
import * as React from 'react';
import { inject, observer } from 'mobx-react';

import Navigation from 'app/pages/common/Navigation';
import SignInButton from 'app/pages/common/SignInButton';
import { client } from 'app/graphql/client';

import SidebarContents from './Sidebar';
import Content from './Content';
import {
  Container,
  Content as ContentContainer,
  LoggedInContainer,
  LoggedInTitle,
  LoggedInSubTitle,
  Sidebar,
  NavigationContainer,
} from './elements';

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.signals.dashboard.dashboardMounted();
  }

  componentWillUnmount() {
    // Reset store so new visits get fresh data
    client.resetStore();
  }

  render() {
    const signedIn = this.props.store.hasLogIn;

    let DashboardContent = (
      <React.Fragment>
        <Sidebar>
          <SidebarContents />
        </Sidebar>

        <ContentContainer>
          <Content />
        </ContentContainer>
      </React.Fragment>
    );

    if (!signedIn) {
      DashboardContent = (
        <Container>
          <LoggedInContainer>
            <LoggedInTitle>Uh oh!</LoggedInTitle>
            <LoggedInSubTitle>
              You need to be signed in to access this page.
            </LoggedInSubTitle>
            <SignInButton style={{ fontSize: '1rem' }} />
          </LoggedInContainer>
        </Container>
      );
    }

    return (
      <Container>
        <NavigationContainer>
          <Navigation title="Dashboard" />
        </NavigationContainer>

        <div style={{ display: 'flex', overflow: 'hidden' }}>
          {DashboardContent}
        </div>
      </Container>
    );
  }
}

export default inject('store', 'signals')(observer(Dashboard));
