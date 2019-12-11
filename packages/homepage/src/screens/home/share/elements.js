import styled, { css } from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 416px 1fr;
  grid-gap: 2.5rem;
  position: relative;

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(25%, 300px));
  grid-gap: 2rem;
  margin-top: 5rem;
  position: relative;
  z-index: 2;
  justify-content: flex-end;

  ${props => props.theme.breakpoints.lg} {
    margin-left: 0px;
    grid-template-columns: repeat(3, 1fr);
  }

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: repeat(3, 1fr);
    margin-top: 2.5rem;
    grid-gap: 1rem;

    img {
      max-width: 100%;
    }
  }
`;

export const White = styled.span`
  color: ${props => props.theme.homepage.white};
`;

const shared = css`
  right: auto;
  left: auto;
  width: 416px;
  margin-top: 0rem;
  height: 22rem;
  position: absolute;
  background: #151515;
`;

export const tweetStyle = css`
  ${shared}
  ${props => props.theme.breakpoints.md} {
    display: none;
  }

  @media screen and (max-width: 1260px) {
    right: auto;
  }
`;

export const tweetStyleMobile = css`
  ${shared}
  display: none;
  margin-top: 3.5rem !important;
  ${props => props.theme.breakpoints.md} {
    display: block;
  }
`;
