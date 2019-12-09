import styled from 'styled-components';

export const Container = styled.div`
  display: inline-flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 1em 0;
  border-right: 1px solid rgba(255, 255, 255, 0.15);

  &:last-child {
    border-right: none;
  }
`;

export const Number = styled.div`
  font-size: 1.125em;
  font-weight: 400;
`;

export const Property = styled.div`
  margin-bottom: 0.4rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875em;
  font-weight: 400;
  text-transform: uppercase;
`;
