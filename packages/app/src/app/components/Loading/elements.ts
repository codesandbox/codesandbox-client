import Centered from '@codesandbox/common/es/components/flex/Centered';
import styled from 'styled-components';

export const FullscreenCentered = styled(Centered).attrs({
  vertical: true,
  horizontal: true,
})`
  height: 100vh;
`;

export const LogoContainer = styled.div`
  color: white;
`;
