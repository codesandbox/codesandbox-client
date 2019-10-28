import React, { useState, useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import RightIcon from 'react-icons/lib/md/keyboard-arrow-right';
import LeftIcon from 'react-icons/lib/md/keyboard-arrow-left';
import { withRouter, Redirect } from 'react-router-dom';
import { Navigation } from 'app/pages/common/Navigation';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import { client } from 'app/graphql/client';

import SidebarContents from './Sidebar';
import Content from './Content';
import {
  Container,
  Content as ContentContainer,
  Sidebar,
  ShowSidebarButton,
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

  const DashboardContent = (
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
    return <Redirect to={signInPageUrl()} />;
  }

  return (
    <Container>
      <Navigation float searchNoInput title="Dashboard" />

      <div style={{ display: 'flex', overflow: 'hidden' }}>
        {DashboardContent}
      </div>
    </Container>
  );
};

export default withRouter(Dashboard);
