import React from 'react';
import Down from 'react-icons/lib/fa/angle-down';
import Up from 'react-icons/lib/fa/angle-up';
import DetailInfo from './DetailInfo';
import { Container, IntegrationBlock, Name } from './elements';

const Integration = ({
  light,
  Icon,
  name,
  deploy,
  children,
  color,
  open = true,
  toggle,
}) => (
  <Container>
    <IntegrationBlock bgColor={color}>
      <div>
        <Icon />
        <Name light={light}>{name}</Name>
      </div>
      {open ? (
        <Up
          css={`
            fill: ${light ? '#000' : '#fff'};
            cursor: pointer;
            width: 1.5rem;
            height: auto;
          `}
          onClick={toggle}
        />
      ) : (
        <Down
          css={`
            fill: ${light ? '#000' : '#fff'};
            cursor: pointer;
            width: 1.5rem;
            height: auto;
          `}
          onClick={toggle}
        />
      )}
    </IntegrationBlock>
    {open ? (
      <DetailInfo
        light={light}
        deploy={deploy}
        info={children}
        bgColor={color}
      />
    ) : null}
  </Container>
);

export default Integration;
