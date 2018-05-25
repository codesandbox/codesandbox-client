import * as React from 'react';
import { inject, observer } from 'mobx-react';

import Navigation from 'app/pages/common/Navigation';
import { Container, Sidebar, NavigationContainer } from './elements';
import Input from 'common/components/Input';

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.signals.cliMounted();
  }

  render() {
    const { user, authToken, isLoadingCLI, error } = this.props.store;

    return (
      <Container>
        <NavigationContainer>
          <Navigation title="Dashboard" />
        </NavigationContainer>

        <div>
          <Sidebar>
            <Input block placeholder="Filter Sandboxes" />
          </Sidebar>
        </div>
      </Container>
    );
  }
}

export default inject('store', 'signals')(observer(Dashboard));
