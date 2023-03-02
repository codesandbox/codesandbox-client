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

  fromTablet: (...args) => css`
    @media (min-width: 660px) {
      ${css(...args)};
    }
  `,

  fromDesktop: (...args) => css`
    @media (min-width: 1280px) {
      ${css(...args)};
    }
  `,
};
