import styled from 'styled-components';
import Padding from '@codesandbox/common/lib/components/spacing/Padding';
import Centered from '@codesandbox/common/lib/components/flex/Centered';

export const Container = styled.div`
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

export const Wrapper = styled(Padding)`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

export const Content = styled(Centered)`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const DotContainer = styled.div`
  font-size: 4rem;
  display: block;
  color: rgb(253, 36, 57);

  svg {
    transition: 0.3s ease opacity;
  }
`;
