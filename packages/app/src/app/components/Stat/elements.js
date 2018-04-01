import styled from 'styled-components';

export const Stat = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 1em 0;
  flex: 1;
  border-right: 1px solid rgba(255, 255, 255, 0.15);

  &:last-child {
    border-right: none;
  }
`;

export const Number = styled.div`
  font-weight: 400;
  font-size: 1.125em;
`;

export const Property = styled.div`
  font-weight: 400;
  font-size: 0.875em;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  margin-bottom: 0.4rem;
`;
