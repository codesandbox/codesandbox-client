// @ts-check
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import RightIcon from 'react-icons/lib/md/keyboard-arrow-right';
import LeftIcon from 'react-icons/lib/md/keyboard-arrow-left';
import { withRouter } from 'react-router-dom';

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
  ShowSidebarButton,
} from './elements';

class Dashboard extends React.Component {
  state = {
    showSidebar: false,
  };

  componentDidMount() {
    this.props.signals.dashboard.dashboardMounted();
  }

  componentWillUnmount() {
    // Reset store so new visits get fresh data
    client.resetStore();
  }

  onRouteChange = () => {
    this.setState({ showSidebar: false });
  };

  toggleSidebar = () => {
    this.setState(({ showSidebar }) => ({ showSidebar: !showSidebar }));
  };

  render() {
    const {
      store: { hasLogIn },
      history,
    } = this.props;
    const { showSidebar } = this.state;

    history.listen(() => {
      this.onRouteChange();
    });

    let DashboardContent = (
      <React.Fragment>
        <Sidebar active={showSidebar}>
          <SidebarContents />
          <ShowSidebarButton onClick={this.toggleSidebar}>
            {showSidebar ? (
              <LeftIcon style={{ color: 'white' }} />
            ) : (
              <RightIcon style={{ color: 'white' }} />
            )}
          </ShowSidebarButton>
        </Sidebar>

        <ContentContainer>
          <Content />
        </ContentContainer>
      </React.Fragment>
    );

    if (!hasLogIn) {
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
          <Navigation searchNoInput title="Dashboard" />
        </NavigationContainer>

        <div style={{ display: 'flex', overflow: 'hidden' }}>
          {DashboardContent}
        </div>
      </Container>
    );
  }
}

export default inject('store', 'signals')(observer(withRouter(Dashboard)));
