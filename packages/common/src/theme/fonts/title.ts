import { css } from 'styled-components';

const base = css`
  font-family: 'Poppins';
`;

export const title = {
  base,
  tiny: css`
    ${base};
    font-weight: 600;
    font-size: 10px;
    line-height: 15px;
  `,
  small: css`
    ${base};
    font-weight: 600;
    font-size: 12px;
    line-height: 18px;
  `,
  normal: css`
    ${base};
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
  `,
  medium: css`
    ${base};
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
  `,
  large: css`
    ${base};
    font-weight: 600;
    font-size: 24px;
    line-height: 36px;
    letter-spacing: -0.02em;
  `,
  huge: css`
    ${base};
    font-weight: 600;
    font-size: 36px;
    line-height: 54px;
    letter-spacing: -0.03em;
  `,
};
