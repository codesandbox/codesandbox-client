import styled, { css } from 'styled-components';
import Select from '@codesandbox/common/lib/components/Select';
import { EntryContainer } from '../../elements';

export const Version = styled.div`
  ${({
    hovering,
    withSize,
    theme,
  }: {
    hovering: boolean;
    withSize: boolean;
    theme: any;
  }) => css`
    position: absolute;
    right: ${hovering ? (withSize ? 5 : 3.5) : 1}rem;
    display: ${hovering ? 'none' : 'block'};
    color: ${theme.background.lighten(2).clearer(0.5)};
    transition: 0.3s ease all;
  `}
`;

export const MoreData = styled(EntryContainer)`
  display: flex;
  flex-direction: column;

  li {
    list-style: none;

    span {
      margin-right: 0.5rem;
      font-weight: bold;
    }

    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
`;

export const VersionSelect = styled(Select)`
  ${({ hovering, theme }: { hovering: boolean; theme: any }) => css`
    position: absolute;
    right: 5rem;
    width: 60px;
    margin-top: -4px;
    color: ${theme.background.lighten(2)};
    visibility: ${hovering ? 'visible' : 'hidden'};
  `}
`;
