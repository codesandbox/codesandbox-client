import styled from 'styled-components';

export const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0 0.5rem;
  padding-right: 2px;
  background-color: #191c1d;
  overflow: hidden;
`;

export const Container = styled.div`
  margin-bottom: 1rem;
  overflow: hidden;

  border-radius: 2px;
`;

export const Actions = styled.div`
  padding: 7px;
  background-color: ${props => props.theme.background2};

  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
`;
