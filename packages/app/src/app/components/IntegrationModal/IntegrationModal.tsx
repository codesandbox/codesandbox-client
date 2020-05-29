import Centered from '@codesandbox/common/es/components/flex/Centered';
import Relative from '@codesandbox/common/es/components/Relative';
import Margin from '@codesandbox/common/es/components/spacing/Margin';
import React from 'react';

import {
  Container,
  DisabledOverlay,
  Division,
  Header,
  PoweredBy,
  Title,
} from './elements';

interface IIntegrationModalProps {
  title: string;
  subtitle: string | React.ReactNode;
  signedIn: boolean;
  Integration: React.ComponentType;
  name: string;
}

export const IntegrationModal: React.FC<IIntegrationModalProps> = ({
  title,
  subtitle,
  Integration,
  signedIn,
  name,
  children,
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
