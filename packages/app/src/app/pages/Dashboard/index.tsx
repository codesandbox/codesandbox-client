import React, { useState, useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import RightIcon from 'react-icons/lib/md/keyboard-arrow-right';
import LeftIcon from 'react-icons/lib/md/keyboard-arrow-left';
import { withRouter } from 'react-router-dom';
import { Navigation } from 'app/pages/common/Navigation';
import { SignInButton } from 'app/pages/common/SignInButton';
import { client } from 'app/graphql/client';

import SidebarContents from './Sidebar';
import Content from './Content';
import {
  Container,
  Centered,
  Content as ContentContainer,
  LoggedInContainer,
  LoggedInTitle,
  Sidebar,
  NavigationContainer,
  ShowSidebarButton,
  OffsettedLogo,
} from './elements';

const Dashboard = props => {
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    state: { hasLogIn },
    actions: { dashboard },
  } = useOvermind();

  useEffect(() => {
    dashboard.dashboardMounted();
    return () => {
      // Reset store so new visits get fresh data
      client.resetStore();
    };
  }, [dashboard]);

  const onRouteChange = () => {
    setShowSidebar(false);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const { history } = props;

  history.listen(({ state }) => {
    if (!!state && state.from === 'sandboxSearchFocused') {
      return;
    }

    onRouteChange();
  });

  let DashboardContent = (
    <>
      <Sidebar active={showSidebar}>
        <SidebarContents />
        <ShowSidebarButton onClick={toggleSidebar}>
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
    </>
  );

  if (!hasLogIn) {
    DashboardContent = (
      <Container>
        <Centered>
          <LoggedInContainer>
            <OffsettedLogo />
            <LoggedInTitle>Sign in to CodeSandbox</LoggedInTitle>

            <SignInButton style={{ fontSize: '1rem' }} />
          </LoggedInContainer>
        </Centered>
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
};

export default withRouter(Dashboard);
