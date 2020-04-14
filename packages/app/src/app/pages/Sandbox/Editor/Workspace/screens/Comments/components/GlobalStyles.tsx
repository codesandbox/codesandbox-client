import { createGlobalStyle, css } from 'styled-components';

const POSITION = css`
  top: 0px;
  left: ${props => props.theme.space[2] + 1}px;
`;

const primary = (theme: any) =>
  '%23' + theme.colors.button.background.split('#')[1];

const makeColor = (color: string) => '%23' + color.split('#')[1];

export const CommentsGlobalStyles = createGlobalStyle`
${({ theme }: any) => css`
  .editor-comments-glyph {
    position: relative;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10H0V5Z' fill='black'/%3E%3C/svg%3E");
    background-size: ${theme.space[3] + 1}px ${theme.space[3] + 1}px;
    background-repeat: no-repeat;
    background-position: center center;
    opacity: 0.3;
    transition: all ${theme.speeds[4]}ms ease;
    position: relative;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  .vs-dark {
    .editor-comments-glyph {
      background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10H0V5Z' fill='${makeColor(
        theme.colors.white
      )}'/%3E%3C/svg%3E");
    }
    .editor-comments-multi:before {
      color: ${theme.colors.grays[600]};
    }
  }

  .editor-comments-glyph.active-comment.editor-comments-multi:before {
    color: ${theme.colors.white};
  }

  .editor-comments-multi:before {
    content: '...';
    color: ${theme.colors.white};
    position: absolute;
    top: -2px;
    left: ${theme.space[2] - 1}px;
    z-index: 10;
    font-size: 8px;
    font-weight: bold;
    height: ${theme.space[3] + 1}px;
    font-family: 'Inter', sans-serif;
  }

  .editor-comments-multi-2:before {
    content: '2';
    ${POSITION}
  }

  .editor-comments-multi-3:before {
    content: '3';
    ${POSITION}
  }
  .editor-comments-multi-4:before {
    content: '4';
    ${POSITION}
  }
  .editor-comments-multi-5:before {
    content: '5';
    ${POSITION}
  }
  .editor-comments-multi-6:before {
    content: '6';
    ${POSITION}
  }
  .editor-comments-multi-7:before {
    content: '7';
    ${POSITION}
  }
  .editor-comments-multi-8:before {
    content: '8';
    ${POSITION}
  }
  .editor-comments-multi-9:before {
    content: '9';
    ${POSITION}
  }

  .editor-comments-glyph.editor-comments-active {
    opacity: 1;
    background-image: url('${`data:image/svg+xml,%3Csvg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 5C0 7.76142 2.23858 10 5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5Z" fill="${primary(
      theme
    )}"/%3E%3Cpath d="M5 5H0V10H5V5Z" fill="${primary(
      theme
    )}"/%3E%3C/svg%3E%0A`}');

      &::before {
        content: '';
      }
  }

  .editor-comments-add:before {
    content: '+';
    font-size: 10px;
    font-weight: bold;
    top: 0;
    left: ${theme.space[2]}px;
  }
`}
`;
