import styled from 'styled-components';
import Row from '@codesandbox/common/lib/components/flex/Row';

export const UserMenuContainer = styled.div`
  display: absolute;
  z-index: 999999999999;
  margin: 5px 0;
  font-size: 0.8rem;
`;

export const ClickableContainer = styled(Row)`
  cursor: pointer;
  background: transparent;
  border: none;
  appearance: none !important;
`;

export const ProfileImage = styled.img`
  border-radius: 2px;

  padding: 2px;
  border: 2px solid ${props => props.theme.secondary};
`;
