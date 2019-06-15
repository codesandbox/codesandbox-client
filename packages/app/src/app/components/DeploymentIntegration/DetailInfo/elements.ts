import styled, { css } from 'styled-components';

export const Details = styled.div`
  ${({ bgColor }: { bgColor: string }) => css`
    flex: 3;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    margin-top: -1px;
    background-color: ${bgColor};
  `}
`;

export const Heading = styled.div`
  ${({ light }: { light: boolean }) => css`
    margin-bottom: 0.25rem;
    color: ${light ? css`rgba(0, 0, 0)` : css`rgba(255, 255, 255)`};
    font-size: 0.75rem;
  `}
`;

export const Info = styled.div`
  ${({ light }: { light: boolean }) => css`
    color: ${light ? css`rgba(0, 0, 0)` : css`rgba(255, 255, 255)`};
    font-weight: 400;
  `}
`;
