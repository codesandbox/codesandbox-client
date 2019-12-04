import styled, { css } from 'styled-components';
import { Button } from '@codesandbox/common/lib/components/Button';
import { PropertyValue } from '../elements';

export const Container = styled.div`
  margin: 1rem;
  margin-top: 5px;
`;

export const PublicValue = styled(PropertyValue)`
  position: relative;
  justify-content: flex-end;
  display: flex;
`;

export const CenteredText = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  svg {
    margin-right: 0.25rem;
    opacity: 0.8;
  }
`;

export const Action = styled(Button).attrs({
  block: true,
})`
  padding: 0.5em 0.7em;
  font-size: 14px;

  &:not(:first-child) {
    margin-top: 1rem;
  }
`;

export const PickColor = styled.button.attrs<{ color: string }>({
  type: 'button',
})`
  ${({ color }) => css`
    position: relative;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;
    background: ${color};
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0;
    cursor: pointer;
  `}
`;

export const PickerContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
`;
