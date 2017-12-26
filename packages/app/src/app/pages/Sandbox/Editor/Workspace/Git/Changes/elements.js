import styled, { css } from 'styled-components';
import { EntryContainer } from '../../elements';

// border-bottom: 1px solid ${({ color }) => color.clearer(0.7)};
export const ChangeContainer = styled.div`
  &:last-child {
    border-bottom: none;
  }
`;

export const Entry = styled(EntryContainer)`
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
