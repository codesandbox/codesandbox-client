import styled, { css, component } from 'app/styled-components';
import { EntryContainer } from '../../elements';

export const ChangeContainer = styled.div`
  &:last-child {
    border-bottom: none;
  }
`;

export const Entry = styled(component<{
  hideColor: boolean
  color: string
  editing: boolean
}>(EntryContainer))`
  display: flex;
  align-items: center;
  line-height: 1;

  ${({ hideColor }) =>
    hideColor &&
    css`
      background-color: transparent;
      padding-left: 0;
    `};

  svg {
    color: ${({ color }) => color};
    margin-right: 0.5rem;
  }
`;
