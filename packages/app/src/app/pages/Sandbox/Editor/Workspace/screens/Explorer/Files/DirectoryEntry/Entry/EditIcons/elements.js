import styled, { css } from 'styled-components';
import fadeIn from '@codesandbox/common/lib/utils/animation/fade-in';

export const Container = styled.div`
  display: flex;
  ${fadeIn(0)};
  vertical-align: middle;
  line-height: 1;
  align-items: center;
`;

export const Icon = styled.div`
  ${({ theme }) => css`
    position: relative;
    display: inline-block;
    transition: 0.3s ease color;
    cursor: pointer;
    color: ${theme.light ? '#6C6C6C' : 'rgba(255, 255, 255, 0.5)'};
    padding-left: 0.5rem;

    &:hover {
      color: ${theme.light ? 'black' : 'rgba(255, 255, 255, 1)'};
    }
  `};
`;
