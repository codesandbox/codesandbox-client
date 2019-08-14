import styled, { css } from 'styled-components';
import { NotificationContainer } from '../elements';

export const Container = styled(NotificationContainer)`
  display: flex;
`;

export const Buttons = styled.div`
  display: flex;
`;

export const Button = styled.div<{ decline?: boolean; disabled?: boolean }>`
  transition: 0.3s ease background-color;
  height: 36px;
  width: 100%;

  color: white;
  background-color: ${props =>
    props.decline ? props.theme.red : props.theme.secondary};

  border: 2px solid
    ${props =>
      props.decline
        ? props.theme.red.lighten(0.1)
        : props.theme.secondary.lighten(0.2)};
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  ${props =>
    props.disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `};
  &:hover {
    background-color: ${props =>
      props.decline
        ? props.theme.red.lighten(0.1)
        : props.theme.secondary.lighten(0.2)};
  }
`;

export const W = styled.span`
  color: white;
`;
