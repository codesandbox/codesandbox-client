import React from 'react';
import { DetailInfo } from './DetailInfo';
import { Container, IntegrationBlock, Name } from './elements';

interface IIntegrationProps {
  small: boolean;
  loading: boolean;
  bgColor: string;
  Icon: React.ComponentType;
  name: string;
  onSignOut?: () => void;
  onSignIn?: () => void;
  userInfo: any; // Replace with userInfo interface
  description: string;
}

export const Integration: React.FC<IIntegrationProps> = ({
  small = false,
  loading,
  bgColor,
  Icon,
  name,
  onSignOut,
  userInfo,
  onSignIn,
  description,
}) => (
  <Container small={small} loading={loading}>
    <IntegrationBlock small={small} bgColor={bgColor}>
      <Icon />
      <Name>{name}</Name>
    </IntegrationBlock>
    {userInfo ? (
      <DetailInfo
        onSignOut={onSignOut}
        heading="Signed in as"
        info={userInfo.email || 'Loading...'}
      />
    ) : (
      <DetailInfo onSignIn={onSignIn} heading="Enables" info={description} />
    )}
  </Container>
);
