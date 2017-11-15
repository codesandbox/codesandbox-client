import { css } from 'styled-components';

export default {
  tablet: (...args) => css`
    @media (max-width: 1279px) {
      ${css(...args)};
    }
  `,

  phone: (...args) => css`
    @media (max-width: 660px) {
      ${css(...args)};
    }
  `,
};
