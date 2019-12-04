import React from 'react';
import { DetailInfo } from './DetailInfo';
import {
  Container,
  Down,
  IntegrationBlock,
  Name,
  Notice,
  Up,
} from './elements';

interface IDeploymentIntegrationProps {
  light?: boolean;
  loading?: boolean;
  bgColor: string;
  Icon: React.ComponentType;
  name: string;
  beta?: boolean;
  open: boolean;
  onToggle: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDeploy: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const DeploymentIntegration: React.FC<IDeploymentIntegrationProps> = ({
  light,
  loading = false,
  bgColor,
  Icon,
  name,
  beta = false,
  open = true,
  onToggle,
  onDeploy,
  children,
}) => (
  <Container>
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
        bgColor={bgColor}
        onDeploy={onDeploy}
        light={light}
        loading={loading}
      >
        {children}
      </DetailInfo>
    ) : null}
  </Container>
);
