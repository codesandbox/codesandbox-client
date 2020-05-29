import { Button } from '@codesandbox/common/es/components/Button';
import styled from 'styled-components';

export const Navigation = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  padding-bottom: 2rem;
`;

export const Notice = styled.div`
  color: rgba(255, 255, 255, 0.5);
  padding: 2rem 0 0;
  margin-bottom: 2rem;
`;

export const NavButton = styled(Button).attrs({
  small: true,
})`
  margin: 0 0.5rem;
`;
