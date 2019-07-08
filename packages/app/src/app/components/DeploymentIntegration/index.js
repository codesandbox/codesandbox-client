import Notice from '@codesandbox/common/lib/components/Notice';
import React from 'react';
import Down from 'react-icons/lib/fa/angle-down';
import Up from 'react-icons/lib/fa/angle-up';

import DetailInfo from './DetailInfo';
import { Container, IntegrationBlock, Name } from './elements';

const Integration = ({
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
        {beta && (
          <Notice
            css={`
              margin-left: 0.7rem;
            `}
          >
            Beta
          </Notice>
        )}
      </div>
      {open ? (
        <Up
          css={`
            fill: ${light ? '#000' : '#fff'};
            cursor: pointer;
            width: 1.5rem;
            height: auto;
          `}
        />
      ) : (
        <Down
          css={`
            fill: ${light ? '#000' : '#fff'};
            cursor: pointer;
            width: 1.5rem;
            height: auto;
          `}
        />
      )}
    </IntegrationBlock>
    {open ? (
      <DetailInfo
        loading={loading}
        light={light}
        deploy={deploy}
        info={children}
        bgColor={color}
      />
    ) : null}
  </Container>
);

export default Integration;
