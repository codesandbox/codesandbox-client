import { Button, Element, Text } from '@codesandbox/components';
import styled from 'styled-components';

export const StyledDisclaimerWrapper = styled(Element)<{
  insideGrid?: boolean;
}>`
  display: flex;
  flex-direction: ${props => (props.insideGrid ? 'column' : 'row')};
  align-items: ${props => (props.insideGrid ? 'flex-start' : 'center')};
  gap: 0;
`;

export const StyledDisclaimerText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.005em;
  color: #999999;
`;

export const StyledDisclaimerButton = styled(Button)<{ insideGrid?: boolean }>`
  display: flex;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: -0.02em;
  color: #ebebeb;
  transition: color ease-in 0.3s;
  padding: 4px ${props => (props.insideGrid ? 0 : '8px')};

  &:hover:not(:disabled),
  &:focus:not(:disabled) {
    color: #e0e0e0;
  }

  &:focus-visible {
    outline: 2px solid #ac9cff;
    outline-offset: -2px;
  }
`;
