import styled from 'styled-components';

// directly copied from app/src/sandbox/status-screen
export const Container = styled.div`
  .cube,
  .cube * {
    position: absolute;
    width: 6rem;
    height: 6rem;
  }
  .cube .sides * {
    opacity: 0.1;
    box-sizing: border-box;
    border: 0.12rem solid white;
    border-radius: 0.25rem;
    background: rgba(255, 255, 255, 0.1);
  }
  .sides {
    transform-style: preserve-3d;
    transform: rotateX(-37.5deg) rotateY(45deg);
  }

  .cube .sides .top {
    transform: rotateX(90deg) translateZ(48px);
    transform-origin: 50% 50%;
  }

  .cube .sides .bottom {
    transform: rotateX(-90deg) translateZ(48px);
    transform-origin: 50% 50%;
  }

  .cube .sides .front {
    transform: rotateY(0deg) translateZ(48px);
    transform-origin: 50% 50%;
  }

  .cube .sides .back {
    transform: rotateY(-180deg) translateZ(48px);
    transform-origin: 50% 50%;
  }
  .cube .sides .left {
    transform: rotateY(-90deg) translateZ(48px);
    transform-origin: 50% 50%;
  }

  .cube .sides .right {
    transform: rotateY(90deg) translateZ(48px);
    transform-origin: 50% 50%;
  }

  .play {
    position: absolute;
    background-color: white;
    top: calc(50% - 0.5rem);
    left: calc(50% - 0.5rem);
  }
  .play:before,
  .play:after {
    content: '';
    position: absolute;
    background-color: inherit;
  }
  .play,
  .play:before,
  .play:after {
    width: 1rem;
    height: 1rem;
    border-top-right-radius: 30%;
  }

  .play {
    transform: rotate(-90deg) skewX(-30deg) scale(1, 0.866);
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.24);
  }
  .play:before {
    transform: rotate(-135deg) skewX(-45deg) scale(1.414, 0.707)
      translate(0, -50%);
  }
  .play:after {
    transform: rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translate(50%);
  }
`;

export const Text = styled.div`
  color: #fff;
  font-family: 'Inter UI', 'Roboto', sans-serif;
  margin-top: 10rem;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  font-weight: 500;
  text-align: center;
`;
