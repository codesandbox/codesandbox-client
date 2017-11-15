import { css } from 'styled-components';

export default {
  tablet: (...args) => css`
    @media (max-width: 1280px) {
      ${css(...args)};
    }
  `,

  phone: (...args) => css`
    @media (max-width: 660px) {
      ${css(...args)};
    }
  `,
};
