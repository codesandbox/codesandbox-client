import styled, { css } from 'styled-components';

import {
  Explanation as ExplanationBase,
  Item as ItemBase,
} from '../../elements';

export const Explanation = styled(ExplanationBase)`
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

export const Item = styled(ItemBase)`
  margin-top: 0.5rem;
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
