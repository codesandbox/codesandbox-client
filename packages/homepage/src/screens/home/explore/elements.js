import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;

export const ImageWrapper = styled.div`
  position: relative;
  max-height: 500px;
  overflow: hidden;

  section {
    max-width: 100vw;
    display: grid;
    grid-template-columns: repeat(4, 324px);
    justify-content: center;
    transform: rotateX(60deg) rotateY(0deg) rotateZ(39deg) translateY(-20rem)
      translateX(-20rem);

    ${props => props.theme.breakpoints.sm} {
      transform: rotateX(60deg) rotateY(0deg) rotateZ(39deg) translateY(-40rem)
        translateX(-10rem);
    }

    > div {
      display: grid;
    }
  }

  img {
    cursor: pointer;
  }

  img {
    transition: 250ms cubic-bezier(0.05, 0.03, 0.35, 1);
    border-radius: 0.5rem;
    height: 570px;
    width: 100%;

    :hover {
      transform: scale(1.05);
      z-index: 10;
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
