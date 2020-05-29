import { GoPrimitiveDot } from 'react-icons/go';
import styled from 'styled-components';

export const Right = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 1rem;
`;

export const NotSyncedIconWithMargin = styled(GoPrimitiveDot)`
  margin-left: 2px;
  color: ${props => props.theme.templateColor || props.theme.secondary};
  vertical-align: middle;

  margin-top: 1.5px;
`;
