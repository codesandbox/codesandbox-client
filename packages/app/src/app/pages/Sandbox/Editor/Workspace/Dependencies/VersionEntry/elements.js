import styled, { css } from 'styled-components';
import Select from '@codesandbox/common/lib/components/Select';
import { EntryContainer } from '../../elements';

const getRight = (hovering, withSize) => {
  if (hovering) {
    if (withSize) {
      return 5;
    }
    return 3.5;
  }

  return 1;
};

export const Version = styled.div`
  ${({ hovering, theme, withSize }) => css`
    transition: 0.3s ease all;
    position: absolute;
    right: ${getRight(hovering, withSize)}rem;
    color: ${theme.background.lighten(2).clearer(0.5)};
    display: ${hovering ? 'none' : 'block'};
  `};
`;

export const MoreData = styled(EntryContainer)`
  display: flex;
  flex-direction: column;

  li {
    list-style: none;

    span {
      font-weight: bold;
      margin-right: 0.5rem;
    }

    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
`;

export const VersionSelect = styled(Select)`
  ${({ hovering, theme }) => css`
    visibility: ${hovering ? 'visible' : 'hidden'};
    width: 60px;
    position: absolute;
    right: 5rem;
    color: ${theme.background.lighten(2)};
    margin-top: -4px;
  `};
`;
