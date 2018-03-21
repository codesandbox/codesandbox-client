import * as React from 'react';

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

type Props = {
  title: string
  name: string
  subtitle: string | React.ReactNode
  Integration: React.ComponentClass<any> | React.SFC<any>
  signedIn: boolean
}

export default class IntegrationModal extends React.Component<Props> {
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
