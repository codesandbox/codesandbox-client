import styled from 'styled-components';
import delayEffect from 'common/utils/animation/delay-effect';
import { Link } from 'react-router-dom';
import LikeHeart from 'app/pages/common/LikeHeart';

export const Container = styled.div`
  background-color: #272c2e;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  padding: 1.5rem;

  display: flex;
  flex-direction: column;

  margin-bottom: 2rem;

  ${delayEffect(0.35)};
`;

export const Title = styled.h1`
  font-weight: 400;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 1.25rem;
  font-weight: 300;
  z-index: 2;
`;

export const Like = styled(LikeHeart)`
  margin-left: 0.5rem;
  transform: translateY(-3px);
`;

export const Description = styled.p`
  font-weight: 300;
  font-size: 1rem;
  margin-right: 3rem;
  color: rgba(255, 255, 255, 0.8);
`;

export const Stats = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-around;
  z-index: 1;
  flex: 4;
`;

export const PlayButtonContainer = styled(Link)`
  position: absolute;
  display: flex;
  justify-content: center;
  top: -160%;
  left: 0;
  right: 0;

  cursor: pointer;

  ${delayEffect(0.5)};
`;
