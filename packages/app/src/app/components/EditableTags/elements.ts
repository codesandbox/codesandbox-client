import { createGlobalStyle, css } from 'styled-components';

export const GlobalStyle = createGlobalStyle<{ color: any }>`${({
  color,
}) => css`
  .react-tagsinput {
    display: flex;
    flex-wrap: row;
    margin: 0 -0.2rem;
    border-radius: 4px;
    color: white;
    overflow: hidden;
  }

  .react-tagsinput-tag {
    display: inline-block;
    padding: 0.3em 0.5em;
    margin: 0.2rem;
    margin-bottom: 6px;
    border-radius: 4px;
    background-color: ${color};
    color: white;
    font-size: 13px;
    font-weight: 500;
  }

  .react-tagsinput-input {
    width: 80px;
    padding: 0.3em;
    margin-top: 1px;
    margin-left: 0.2rem;
    margin-bottom: 6px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.1);
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    font-weight: 400;
    outline: none;
    transition: 0.3s ease border-color;

    &:focus {
      border-color: ${color.clearer(0.3)};
    }
  }

  .react-tagsinput-remove {
    color: rgba(255, 255, 255, 0.6);
    font-weight: bold;
    cursor: pointer;
  }

  .react-tagsinput-tag a::before {
    content: ' ×';
  }
`}`;
