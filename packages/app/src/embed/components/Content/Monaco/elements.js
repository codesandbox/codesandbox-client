import styled from 'styled-components';
import theme from '@codesandbox/common/lib/theme';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  z-index: 30;
`;

export const CodeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 30;

  .greensquiggly {
    background: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%23ffd399'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")
      repeat-x bottom left !important;
  }

  .jest-success {
    display: flex;
    align-items: center;
    justify-content: center;

    &:after {
      content: '';
      width: 50%;
      height: 50%;
      background-color: ${theme.green()};
      border-radius: 50%;
    }
  }

  .jest-error {
    display: flex;
    align-items: center;
    justify-content: center;

    &:after {
      content: '';
      width: 50%;
      height: 50%;
      background-color: ${theme.red()};
      border-radius: 50%;
    }
  }

  /* For retina screens we will not do subpixel anti-aliasing. That looks uglier. */
  @media (-webkit-min-device-pixel-ratio: 1.5) {
    -webkit-font-smoothing: auto;
  }
`;
