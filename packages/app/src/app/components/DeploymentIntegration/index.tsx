import React from 'react';
import DetailInfo from './DetailInfo';
import {
  Container,
  IntegrationBlock,
  Name,
  Notice,
  Up,
  Down,
} from './elements';

interface IDeploymentIntegrationProps {
  light?: boolean;
  loading: boolean;
  bgColor: string;
  Icon: React.ComponentType;
  name: string;
  beta: boolean;
  open: boolean;
  onToggle: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDeploy: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const DeploymentIntegration = ({
  light,
  loading,
  bgColor,
  Icon,
  name,
  beta,
  open = true,
  onToggle,
  onDeploy,
  children,
}: IDeploymentIntegrationProps) => (
  <Container light={light} loading={loading}>
    <IntegrationBlock bgColor={bgColor} onClick={onToggle}>
      <div>
        <Icon />
        <Name light={light}>{name}</Name>
        {beta && <Notice>Beta</Notice>}
      </div>
      {open ? <Up light={light} /> : <Down light={light} />}
    </IntegrationBlock>
    {open ? (
      <DetailInfo
        light={light}
        loading={loading}
        bgColor={bgColor}
        onDeploy={onDeploy}
      >
        {children}
      </DetailInfo>
    ) : null}
  </Container>
);

export default DeploymentIntegration;
