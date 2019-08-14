import styled from 'styled-components';

export const Legend = styled.div`
  display: flex;
  padding-top: 1rem;
  margin-top: 56px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  li:not(:last-child) {
    margin-right: 30px;
  }
`;

export const LegendLi = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
`;

export const Dot = styled.div`
  width: 1rem;
  height: 1rem;
  background: ${props => (props.down ? '#F59300' : '#30d158')};
  border-radius: 50%;
  margin-right: 0.5rem;
`;
