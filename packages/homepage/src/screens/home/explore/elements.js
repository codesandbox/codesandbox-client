import styled from 'styled-components';

export const itemWidth = 324;
export const smallItemHeight = 420;
export const bigItemHeight = 548;

export const Container = styled.div`
  position: relative;
`;

export const ImageWrapper = styled.div`
  position: relative;
  transform: translateY(-380px);
  section {
    max-width: 100vw;
    display: grid;
    grid-template-columns: repeat(4, minmax(320px, 100%));
    grid-gap: 1rem;
    justify-content: center;
    transform: rotateX(60deg) rotateY(0deg) rotateZ(45deg) translateY(0rem)
      translateX(-0rem);

    > div {
      display: grid;
      grid-row-gap: 1rem;
    }
  }

  img,
  iframe {
    transition: 250ms cubic-bezier(0.05, 0.03, 0.35, 1);
    border-radius: 0.5rem;
    height: 570px;
    width: 100%;

    :hover {
      transform: scale(1.05);
    }
  }

  &::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

export const StylessButton = styled.a`
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
  text-decoration: none;
`;

export const Image = styled.img``;

export const Iframe = styled.iframe`
  border: 0;
  border-radius: 4;
  overflow: hidden;
`;
