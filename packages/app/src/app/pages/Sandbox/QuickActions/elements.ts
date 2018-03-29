import styled, { css, component } from 'app/styled-components';

export const Container = styled.div`
  position: absolute;

  top: 20vh;
  left: 0;
  right: 0;

  z-index: 60;

  margin: auto;
  padding-bottom: 0.25rem;

  background-color: ${props => props.theme.background};

  max-width: 650px;
  width: 100%;

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.6);

  color: rgba(255, 255, 255, 0.6);
`;

export const Items = styled.div`
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const InputContainer = styled.div`
  padding: 0.5rem;
  input {
    width: 100%;
  }
`;

export const Entry = styled(component<{
  isActive?: boolean
}>())`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  min-height: 1.5rem;
  cursor: pointer;

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: ${props => props.theme.secondary.clearer(0.7)};
      color: rgba(255, 255, 255, 0.8);
    `};
`;

export const Title = styled.div`
  flex: 1;
`;

export const Keybindings = styled.div`
  float: right;
`;
