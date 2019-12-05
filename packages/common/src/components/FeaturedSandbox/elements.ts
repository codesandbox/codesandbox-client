import styled from 'styled-components';
import { UserWithAvatar } from '../UserWithAvatar';
import theme from '../../theme';
import Stats from '../Stats/index';

const VERTICAL_BREAKPOINT = 900;

export const Container = styled.div<{ height?: number }>`
  transition: 0.3s ease background-color;

  position: relative;
  background-color: ${theme.new.bg};
  border-radius: 8px;
  color: ${theme.new.title};
  height: ${props => props.height || 500}px;
  display: flex;
  box-shadow: 0 9px 14px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  z-index: 1;
  border: 1px solid #242424;

  cursor: pointer;

  &:hover {
    background-color: ${theme.new.bg.lighten(0.2)};
  }

  @media screen and (max-width: ${VERTICAL_BREAKPOINT}px) {
    flex-direction: column;
    min-height: 800px;

    font-size: 0.875em;

    h1 {
      font-size: 1.25em;
    }
  }
`;

export const SandboxPreviewImage = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;

  @media screen and (max-width: ${VERTICAL_BREAKPOINT}px) {
    /* Manually measured using the devtools, probably (height / 2 - navigation bar size) */
    height: 257.5px;
  }
`;

export const SandboxContainer = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  @media screen and (max-width: ${VERTICAL_BREAKPOINT}px) {
    height: 230px;
    z-index: 11;
    background-color: ${theme.new.bg};
    padding: 0.5em;
  }
`;

export const SandboxInfo = styled.div`
  max-width: 400px;
  text-align: center;
`;

export const Title = styled.h1`
  margin-bottom: 0.5em;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 2.125em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  max-height: 8rem;
  overflow: hidden;
`;

export const Description = styled.p`
  color: ${theme.new.description};
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1em;
`;

export const Author = styled(UserWithAvatar)`
  position: absolute;
  left: 1.5em;
  bottom: 1.5em;
  color: ${theme.new.description};
  font-weight: 600;
`;

export const IconContainer = styled.div`
  display: flex;
  position: absolute;
  right: 1.5em;
  bottom: 1.5em;

  img {
    width: 40px;
    height: 40px;
  }
`;
export const StyledStats = styled(Stats)`
  color: ${theme.new.description};
  font-weight: 600;
  margin-top: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
`;
