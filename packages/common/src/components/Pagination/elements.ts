import styled, { css } from 'styled-components';
import { Button as BaseButton } from 'reakit/Button';
import { withoutProps } from '../../utils';

export const Navigation = styled.nav.attrs({
  role: 'navigation',
  'aria-label': 'Pagination Navigation',
})``;

export const Controls = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const Button = styled(withoutProps(`active`)(BaseButton))<{
  active: boolean;
}>`
  ${({ active }) => css`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 22px;
    padding: 0;
    margin: 0 2px;
    border: none;
    background: ${active ? css`#40A9F3` : css`none`};
    border-radius: 4px;
    color: ${active ? css`#fff` : css`#b8b9ba`};
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;

    &:disabled {
      color: ${active ? css`#fff` : css`#666`};
      cursor: default;
    }

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      color: #fff;
      background: ${active ? css`#40A9F3` : css`rgba(108, 174, 221, 0.2);`};
    }
  `}
`;
