import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { withRouter, Redirect, RouteComponentProps } from 'react-router-dom';

import { client } from 'app/graphql/client';
import { useOvermind } from 'app/overmind';
import { Navigation } from './Navigation';

import Content from './Content';
import {
  Container,
  ContentContainer,
  LeftIcon,
  RightIcon,
  SidebarContainer,
  ShowSidebarButton,
} from './elements';
import { Sidebar } from './Sidebar';

type Props = RouteComponentProps;
const DashboardComponent: FunctionComponent<Props> = ({ history }) => {
  const {
    actions: {
      dashboard: { dashboardMounted },
    },
    state: { hasLogIn },
  } = useOvermind();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    dashboardMounted();

    // Reset store so new visits get fresh data
    return () => client.resetStore();
  }, [dashboardMounted]);

  history.listen(({ state }) => {
    if (state?.from === 'sandboxSearchFocused') {
      return;
    }

    setShowSidebar(false);
  });

  if (!hasLogIn) {
    return <Redirect to={signInPageUrl()} />;
  }

  return (
    <Container>
      <Navigation float searchNoInput title="Dashboard" />

      <div style={{ display: 'flex', overflow: 'hidden' }}>
        <SidebarContainer active={showSidebar}>
          <Sidebar />

          <ShowSidebarButton onClick={() => setShowSidebar(show => !show)}>
            {showSidebar ? <LeftIcon /> : <RightIcon />}
          </ShowSidebarButton>
        </SidebarContainer>

        <ContentContainer>
          <Content />
        </ContentContainer>
      </div>
    </Container>
  );
};

export const Dashboard = withRouter(DashboardComponent);
