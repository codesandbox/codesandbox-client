import styled from 'styled-components';
import UserWithAvatar from 'app/src/app/components/UserWithAvatar';
import Stats from 'common/components/Stats';

const VERTICAL_BREAKPOINT = 900;

export const Container = styled.div`
  position: relative;
  background-color: ${props => props.theme.new.bg};
  border-radius: 8px;
  color: ${props => props.theme.new.title};
  height: 500px;
  display: flex;
  box-shadow: 0 9px 14px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  z-index: 1;

  @media screen and (max-width: ${VERTICAL_BREAKPOINT}px) {
    flex-direction: column;
    min-height: 800px;

    font-size: 0.875rem;

    h1 {
      font-size: 1.25rem;
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
    background-color: ${props => props.theme.new.bg};
    padding: 0.5rem;
  }
`;

export const SandboxInfo = styled.div`
  max-width: 400px;
  text-align: center;
`;

export const Title = styled.h1`
  margin-bottom: 0.5rem;
  font-family: 'Poppins';
  font-weight: 600;
`;

export const Description = styled.p`
  color: ${props => props.theme.new.description};
  font-family: 'Poppins';
  font-weight: 600;
  font-size: 1rem;
`;

export const Author = styled(UserWithAvatar)`
  position: absolute;
  left: 1.5rem;
  bottom: 1.5rem;
  color: ${props => props.theme.new.description};
  font-weight: 600;
`;

export const IconContainer = styled.div`
  display: flex;
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;

  img {
    width: 40px;
    height: 40px;
  }
`;
export const StyledStats = styled(Stats)`
  color: ${props => props.theme.new.description};
  font-weight: 600;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
