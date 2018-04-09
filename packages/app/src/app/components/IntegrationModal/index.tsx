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

export type Props = {
  title: string;
  name: string;
  subtitle: string | React.ReactNode;
  Integration: React.ComponentClass<any> | React.SFC<any>;
  signedIn: boolean;
};

const IntegrationModal: React.SFC<Props> = ({
  title,
  children,
  name,
  subtitle,
  Integration,
  signedIn,
}) => (
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

export default IntegrationModal;
