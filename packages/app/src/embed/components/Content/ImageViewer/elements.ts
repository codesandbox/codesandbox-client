import styled from 'styled-components';
import Centered from '@codesandbox/common/lib/components/flex/Centered';

export const Container = styled(Centered)`
  height: 100%;
  color: ${props =>
    props.theme['editor.foreground'] || 'rgba(255, 255, 255, 0.9)'};
  overflow: auto;
  padding: 1rem;
`;

export const Title = styled.div`
  font-size: 2rem;
  margin-top: 3rem;
  margin: 1rem 0;
`;

export const SubTitle = styled.div`
  font-size: 1.5rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
`;

export const Image = styled.img`
  margin-top: 2rem;
  margin-bottom: 1rem;

  max-width: 80%;
  max-height: 70%;
`;

export const MaxWidth = styled.form`
  display: flex;
  justify-content: centered;
  flex-direction: row;
  width: 80%;

  input {
    flex: 4;
    font-size: 1.5rem;
  }

  button {
    flex: 1;
    margin-left: 1rem;
  }
`;
