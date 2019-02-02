import React from 'react';
import Down from 'react-icons/lib/fa/angle-down';
import Up from 'react-icons/lib/fa/angle-up';
import DetailInfo from './DetailInfo';
import { Container, IntegrationBlock, Name } from './elements';

function Integration({
  Icon,
  name,
  deploy,
  children,
  color,
  loading,
  open = true,
  toggle,
}) {
  return (
    <Container loading={loading}>
      <IntegrationBlock bgColor={color}>
        <div>
          <Icon />
          <Name>{name}</Name>
        </div>
        {open ? (
          <Up
            css={`
              cursor: pointer;
              width: 1.5rem;
              height: auto;
            `}
            onClick={toggle}
          />
        ) : (
          <Down
            css={`
              cursor: pointer;
              width: 1.5rem;
              height: auto;
            `}
            onClick={toggle}
          />
        )}
      </IntegrationBlock>
      {open ? (
        <DetailInfo deploy={deploy} info={children} bgColor={color} />
      ) : null}
    </Container>
  );
}

export default Integration;
