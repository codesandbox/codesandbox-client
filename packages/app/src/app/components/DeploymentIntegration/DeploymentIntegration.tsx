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

export const DeploymentIntegration = ({
  beta = false,
  children,
  color,
  deploy,
  Icon,
  light = false,
  loading = false,
  name,
  open = true,
  toggle,
}) => (
  <Container>
    <IntegrationBlock bgColor={color} onClick={toggle}>
      <div>
        <Icon />

        <Name light={light}>{name}</Name>

        {beta && <Notice>Beta</Notice>}
      </div>

      {open ? <Up light={light} /> : <Down light={light} />}
    </IntegrationBlock>

    {open ? (
      <DetailInfo
        bgColor={color}
        deploy={deploy}
        info={children}
        light={light}
        loading={loading}
      />
    ) : null}
  </Container>
);
