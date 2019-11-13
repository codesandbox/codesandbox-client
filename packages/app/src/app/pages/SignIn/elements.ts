import styled from 'styled-components';
import Logo from '@codesandbox/common/lib/components/Logo';

export const Container = styled.div`
  height: 100%;
  width: 100%;

  color: rgba(255, 255, 255, 0.8);
`;

export const Centered = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
`;

export const OffsettedLogo = styled(Logo)`
  margin-top: -110px;
  margin-bottom: 30px;
  color: white;

  background-color: ${props => props.theme.background4};
  width: 75px;
  height: 75px;

  padding: 1rem;
  border-radius: 8px;
`;

export const LoggedInContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 300px;
  margin: 0 auto;

  padding: 4rem;
  border-radius: 4px;
  background-color: ${props => props.theme.background};
`;

export const LoggedInTitle = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.new.title};
  font-weight: 600;
  margin-bottom: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;
