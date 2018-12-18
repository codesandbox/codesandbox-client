import styled from 'styled-components';
import NotSyncedIcon from 'react-icons/lib/go/primitive-dot';

export const Right = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 1rem;
`;

export const NotSyncedIconWithMargin = styled(NotSyncedIcon)`
  margin-left: 2px;
  color: ${props => props.theme.templateColor || props.theme.secondary};
  vertical-align: middle;

  margin-top: 1.5px;
`;

export const Entry = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  opacity: ${props => (props.hovering ? 0.6 : 0)};
  margin-top: 3px;
  margin-right: 3px;
`;
