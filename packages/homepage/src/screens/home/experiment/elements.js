import styled, { css } from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 304px;
  grid-gap: 2rem;
  position: relative;
  margin-top: 5rem;

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: 1fr 1fr;
  }

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 300px);
  grid-gap: 2rem;
  margin-top: 5rem;
  position: relative;
  z-index: 2;

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    margin-top: 2.5rem;

    img {
      max-width: 100%;
    }
  }
`;

export const White = styled.span`
  color: white;
`;

export const shared = css`
  right: 1rem;
  left: auto;
  width: 25rem;
  margin-top: 1rem;
  height: 22rem;
  background: #151515;
`;

export const tweetStyle = css`
  ${shared}
  ${props => props.theme.breakpoints.md} {
    display: none;
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
