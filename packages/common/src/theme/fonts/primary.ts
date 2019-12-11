import { css } from 'styled-components';

const base = css`
  font-family: 'Open Sans';
`;

export const primary = {
  base,
  tiny: css`
    ${base};
    font-size: 10px;
    line-height: 14px;
    letter-spacing: -0.04em;
  `,
  small: css`
    ${base};
    font-size: 12px;
    line-height: 16px;
    letter-spacing: -0.04em;
  `,
  normal: css`
    ${base};
    font-size: 14px;
    line-height: 19px;
    letter-spacing: -0.04em;
  `,
  medium: css`
    ${base};
    font-size: 18px;
    line-height: 25px;
    letter-spacing: -0.02em;
  `,
  large: css`
    ${base};
    font-weight: 300;
    font-size: 24px;
    line-height: 33px;
    letter-spacing: -0.04em;
  `,
  huge: css`
    ${base};
    font-weight: 300;
    font-size: 36px;
    line-height: 49px;
    letter-spacing: -0.06em;
  `,
};
