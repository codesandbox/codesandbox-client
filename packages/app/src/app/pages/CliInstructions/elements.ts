import styled from 'styled-components';
import Centered from '@codesandbox/common/lib/components/flex/Centered';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 1rem;
`;

export const Content = styled(Centered)`
  max-width: 50em;
  margin: auto;
  margin-top: 10%;
`;

export const Code = styled.pre<{ theme: any }>`
  margin-bottom: 1rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
`;
