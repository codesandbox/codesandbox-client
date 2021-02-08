import React from 'react';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import {
  Container,
  Title,
  PoweredBy,
  Header,
  Division,
  DisabledOverlay,
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
      <div
        css={`
          position: relative;
        `}
      >
        {!signedIn && (
          <DisabledOverlay>Sign in to {name} to continue</DisabledOverlay>
        )}
        {children}
      </div>
    </div>
  </Container>
);
