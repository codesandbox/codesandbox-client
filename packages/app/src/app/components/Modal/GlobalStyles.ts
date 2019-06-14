import { createGlobalStyle } from 'styled-components';
import { CLOSE_TIMEOUT_MS } from './constants';

export const GlobalStyles = createGlobalStyle`
.ReactModal__Content {
  transition: all ${CLOSE_TIMEOUT_MS}ms ease;
  transition-property: opacity, transform;
  opacity: 0;
  transform: scale(0.9) translateY(5px);

  h2 {
    margin-top: 14px;
  }
}

.ReactModal__Overlay {
  transition: all ${CLOSE_TIMEOUT_MS}ms ease;
  transition-property: opacity, transform;
  z-index: 10;
  opacity: 0;
}

.ReactModal__Overlay--after-open {
  transition: all ${CLOSE_TIMEOUT_MS}ms ease;
  z-index: 10;
  opacity: 1;
}

.ReactModal__Html--open {
  overflow-y: hidden;
}

.ReactModal__Content--after-open {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.ReactModal__Overlay--before-close {
  opacity: 0;
}

.ReactModal__Content--before-close {
  opacity: 0;
  transform: scale(0.9) translateY(0);
}
`;
