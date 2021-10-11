import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  height: 2rem;
  align-items: center;
`;

const Item = styled.div`
  background: white;
  height: 2px;
`;

export const Navigation: React.FC<{ amount: number }> = ({ amount }) => {
  return (
    <Wrapper>
      {new Array(amount).fill(' ').map((item, index) => {
        return (
          <Item
            key={index}
            style={{ width: `calc(100% / ${amount} - 1rem)` }}
          />
        );
      })}
    </Wrapper>
  );
};
