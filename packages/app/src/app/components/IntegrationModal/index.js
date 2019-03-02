import React from 'react';

import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';
import Relative from 'common/components/Relative';

import {
  Container,
  Title,
  PoweredBy,
  Header,
  Division,
  DisabledOverlay,
} from './elements';

export default class IntegrationModal extends React.Component {
  state = {
    deploying: false,
    url: null,
  };

  render() {
    const {
      title,
      children,
      name,
      subtitle,
      Integration,
      signedIn,
    } = this.props;

    return (
      <Container>
        <Header>
          <Title>{title}</Title>
          <PoweredBy>{subtitle}</PoweredBy>
        </Header>
        <div>
          <Centered horizontal>
            <Margin margin={2}>
              <Integration />
            </Margin>
          </Centered>
          <Division />
          <Relative>
            {!signedIn && (
              <DisabledOverlay>Sign in to {name} to continue</DisabledOverlay>
            )}
            {children}
          </Relative>
        </div>
      </Container>
    );
  }
}
