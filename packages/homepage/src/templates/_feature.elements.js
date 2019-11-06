import styled, { css } from 'styled-components';

export const Title = styled.h1`
  ${({ theme, textCenter }) => css`
    font-family: ${theme.homepage.appleFont};
    font-weight: 500;
    font-size: 40px;
    line-height: 48px;
    color: ${theme.homepage.white};
    margin: 0.5rem 0;

    ${textCenter &&
      css`
        text-align: center;
        max-width: 50%;
        margin: auto;
      `}
  `};
`;

export const Description = styled.h2`
  ${({ theme }) => css`
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;

    color: ${theme.homepage.white};
  `};
`;

export const Banner = styled.div`
  ${({ color, reverse, coverSmaller }) => css`
    background: #${color};
    height: ${coverSmaller ? '380px' : '480px'};
    width: 100%;
    border-radius: 4px;
    margin-bottom: 7.5rem;
    margin-top: 3.75rem;
    position: relative;
    display: grid;
    grid-template-columns: ${reverse ? '500px 1fr' : '1fr 500px'};
    grid-gap: 5rem;
    justify-content: space-between;
    align-items: flex-end;
    flex-grow: 0;
    flex-shrink: 1;
    overflow: hidden;
    grid-auto-flow: column-reverse;

    img {
      display: block;
      filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.4));
    }
  `};
`;

export const ContentBlock = styled.div`
  ${({ theme, columns }) => css`
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    grid-gap: 5rem;
    font-size: 16px;
    line-height: 23px;
    color: ${theme.homepage.muted};

    h3 {
      font-style: normal;
      font-weight: 500;
      font-size: 23px;
      line-height: 27px;
      color: ${theme.homepage.white};
    }
  `};
`;

export const Tweet = styled.div`
  ${({ theme, reverse }) => css`
    ${reverse ? 'margin-right: 3rem' : 'margin-left: 3rem'};
    font-family: Roboto;
    font-style: italic;
    font-weight: normal;
    color: ${theme.homepage.white};
    font-size: 23px;
    line-height: 32px;
    align-self: center;
  `};
`;

export const User = styled.div`
  ${({ theme }) => css`
    font-family: ${theme.homepage.appleFont};
    margin-top: 1.5rem;
    align-items: center;
    font-style: normal;
    display: flex;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;

    color: ${theme.homepage.white};

    p {
      margin-bottom: 0.1rem;
    }
  `};
`;

export const Avatar = styled.img`
  width: 64px;
  height: 64px;
  margin-right: 1rem;
  border-radius: 50%;
`;
