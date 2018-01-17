import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  height: 2rem;
  min-height: 2rem;
  width: 100%;
  background-color: ${props => props.theme.background.darken(0.3)};

  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  position: relative;
  height: 1.5rem;
  width: 100%;
  background-color: ${props => props.theme.background.darken(0.3)};
  border: none;
  outline: none;
  color: rgba(255, 255, 255, 0.8);
  font-family: Menlo, monospace;
  font-size: 13px;
`;

export const IconContainer = styled.div`
  display: inline-flex;
  padding: 0.5rem 0;
  width: 24px;
  align-items: center;
  justify-content: center;
`;
