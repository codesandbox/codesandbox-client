import styled, { css } from 'styled-components';

export const Details = styled.div<{ bgColor: string }>`
  ${({ bgColor }) => css`
    flex: 3;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    margin-top: -1px;
    background-color: ${bgColor};
  `}
`;

export const Heading = styled.div<{ light: boolean }>`
  ${({ light }) => css`
    margin-bottom: 0.25rem;
    color: ${light ? '#000000' : '#ffffff'};
    font-size: 0.75rem;
  `}
`;

export const Info = styled.div<{ light: boolean }>`
  ${({ light }) => css`
    color: ${light ? '#000000' : '#ffffff'};
    font-weight: 400;
  `}
`;
