import styled, { css } from 'styled-components';

export const Details = styled.div<{ bgColor: string }>`
  ${({ bgColor }) => css`
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    flex: 3;
    padding: 0.75rem 1rem;
    background-color: ${bgColor};
    margin-top: -1px;
  `}
`;

export const Heading = styled.div<{ light: boolean }>`
  ${({ light }) => css`
    color: ${light ? '#000000' : '#ffffff'};
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  `}
`;

export const Info = styled.div<{ light: boolean }>`
  ${({ light }) => css`
    color: ${light ? '#000000' : '#ffffff'};
    font-weight: 400;
  `}
`;
