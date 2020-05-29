import { signInPageUrl } from '@codesandbox/common/es/utils/url-generator';
import { client } from 'app/graphql/client';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';

import Content from './Content';
import {
  Container,
  ContentContainer,
  LeftIcon,
  RightIcon,
  ShowSidebarButton,
  SidebarContainer,
} from './elements';
import { Navigation } from './Navigation';
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
