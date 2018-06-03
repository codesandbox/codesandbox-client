// @ts-check
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import Navigation from 'app/pages/common/Navigation';

import SidebarContents from './Sidebar';
import Content from './Content';
import {
  Container,
  Content as ContentContainer,
  Sidebar,
  NavigationContainer,
} from './elements';

import 'app/graphql/client';

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.signals.dashboard.dashboardMounted();
  }

  render() {
    return (
      <Container>
        <NavigationContainer>
          <Navigation title="Dashboard" />
        </NavigationContainer>

        <div style={{ display: 'flex', overflow: 'hidden' }}>
          <Sidebar>
            <SidebarContents />
          </Sidebar>

          <ContentContainer>
            <Content />
          </ContentContainer>
        </div>
      </Container>
    );
  }
}

export default inject('store', 'signals')(
  DragDropContext(HTML5Backend)(observer(Dashboard))
);
