import styled, { css, component } from 'app/styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 4rem;
  flex: 0 0 4rem;
  height: 100%;
  color: rgba(255, 255, 255, 0.6);

  font-size: 1.5rem;
  align-items: center;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
`;

export const IconContainer = styled(component<{
  selected: boolean
  onClick: () => void
}>())`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s ease all;
  height: 64px;
  width: 64px;
  cursor: pointer;

  &:hover {
    color: white;
  }

  ${props =>
    props.selected &&
    css`
      color: white;
      background-color: ${props.theme.templateColor
        ? props.theme.templateColor()
        : props.theme.secondary()};
    `};
`;
