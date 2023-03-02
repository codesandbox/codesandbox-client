import styled, { css } from 'styled-components';

export const Title = styled.h1`
  ${({ theme, textCenter }) => css`
    font-weight: 900;
    font-family: ${theme.homepage.appleFont};
    font-size: 2.5rem;
    line-height: 3rem;
    color: ${theme.homepage.white};
    margin: 0.5rem 0;

    ${textCenter &&
    css`
      text-align: center;
      max-width: 50%;
      margin: auto;
    `}
  `};
  ${props => props.theme.breakpoints.md} {
    max-width: 80%;
  }

  ${props => props.theme.breakpoints.sm} {
    font-size: 2.1rem;
  }
`;

export const Description = styled.h2`
  ${({ theme }) => css`
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.5;

    color: ${theme.homepage.white};
  `};
`;

export const Banner = styled.div`
  ${({ color, bgImage, reverse, coverSmaller }) => css`
    background: #${color} url(${bgImage}) center;
    background-size: cover;
    height: ${coverSmaller ? '380px' : '480px'};
    width: 100%;

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

    clip-path: inset(0px round 0.5rem);
    -webkit-mask-image: -webkit-radial-gradient(white, black);
    overflow: hidden;

    ${props => props.theme.breakpoints.lg} {
      grid-template-columns: ${reverse ? '30% 1fr' : '1fr 30%'};
    }

    ${props => props.theme.breakpoints.md} {
      grid-template-columns: 1fr;
      height: auto;
    }

    .hero-image {
      display: block;
      filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.4));

      ${props => props.theme.breakpoints.lg} {
        width: 230%;
        ${reverse &&
        css`
          transform: translateX(-56%);
        `};

        max-width: initial;
      }

      ${props => props.theme.breakpoints.md} {
        transform: translateX(0);
        filter: none;
        max-width: 100%;
        width: 100%;
      }
    }
  `};
`;

export const SeoText = styled.p`
  color: ${props => props.theme.homepage.muted};
  font-style: normal;
  font-weight: 500;
  font-size: 1.4375rem;
  line-height: 2rem;
`;

export const ContentBlock = styled.div`
  ${({ theme, columns }) => css`
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    grid-gap: 3rem 5rem;
    font-size: 1rem;
    line-height: 1.5rem;
    color: ${theme.homepage.muted};

    ${props => props.theme.breakpoints.md} {
      grid-template-columns: 1fr;
    }

    h3 {
      font-style: normal;
      font-weight: 500;
      font-size: 1.4375rem;
      line-height: 27px;
      color: ${theme.homepage.white};
      /* min-height: 54px; */
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
    font-size: 1.4375rem;
    line-height: 32px;
    align-self: center;

    ${props => props.theme.breakpoints.md} {
      padding-top: 2rem;

      max-width: 80%;
      margin: auto;
    }
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
    font-size: 1rem;
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

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  ${props => props.theme.breakpoints.md} {
    display: block;
  }
`;

export const Wrapper = styled.div`
  padding: 4.5rem 0rem 1rem 0rem;
`;
