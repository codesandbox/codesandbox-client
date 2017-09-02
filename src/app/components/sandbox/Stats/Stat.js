import React from 'react';
import styled from 'styled-components';

const CenteredText = styled.div`
  display: inline-flex;
  width: 33%;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  svg {
    opacity: 0.8;
  }
`;

type Props = {
  Icon: React.CElement,
  count: number,
};

export default ({ Icon, count }: Props) => (
  <CenteredText>
    {Icon}
    <span
      style={{
        marginLeft: '0.5em',
        fontWeight: 300,
      }}
    >
      {count.toLocaleString()}
    </span>
  </CenteredText>
);
