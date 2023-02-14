import React from 'react';
import { DetailInfo } from './DetailInfo';
import { Container, IntegrationBlock, Name } from './elements';

interface IntegrationProps {
  small: boolean;
  loading: boolean;
  Icon: React.ComponentType;
  name: string;
  onSignOut?: () => void;
  onSignIn?: () => void;
  userInfo: any; // Replace with userInfo interface
  description: string;
}

export const Integration: React.FC<IntegrationProps> = ({
  small = false,
  loading,
  Icon,
  name,
  onSignOut,
  userInfo,
  onSignIn,
  description,
}) => (
  <Container small={small} loading={loading}>
    <IntegrationBlock>
      <Icon />
      <Name>{name}</Name>
    </IntegrationBlock>
    <DetailInfo
      {...(userInfo
        ? {
            onSignOut,
            heading: 'Signed in as',
            info: userInfo.email || 'Loading...',
          }
        : {
            onSignIn,
            heading: 'Enables',
            info: description,
          })}
    />
  </Container>
);
