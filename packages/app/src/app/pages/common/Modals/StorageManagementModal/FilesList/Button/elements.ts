import TooltipBase from '@codesandbox/common/lib/components/Tooltip';
import styled from 'styled-components';

export const Tooltip = styled(TooltipBase)`
  font-size: 1.2em;
  background-color: inherit;
  border: none;
  padding: 5px 6px 9px 6px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 1);
  }

  &[disabled] {
    opacity: 0.5;
    cursor: default;
  }
`;
