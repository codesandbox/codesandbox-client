import React, { Fragment } from 'react';
import { createGlobalStyle } from 'styled-components';
import TagsInput from 'react-tagsinput';

function hexToRgb(hex, a) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
        result[3],
        16
      )},${a})`
    : null;
}

const GlobalStyle = createGlobalStyle`
  .react-tagsinput {
    display: flex;
    flex-wrap: row;
    overflow: hidden;
    border-radius: 4px;
    color: white;

    margin: 0 -.2rem;
  }

  .react-tagsinput-tag {
    display: inline-block;
    margin: 0.2rem;
    font-size: 13px;
    padding: 0.3em 0.5em;
    background-color: ${props => props.color};
    color: white;
    font-weight: 500;
    border-radius: 4px;
    margin-bottom: 6px;
  }

  .react-tagsinput-input {
    transition: 0.3s ease border-color;

    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: rgba(255,255,255,0.9);
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 6px;
    margin-top: 1px;
    outline: none;
    padding: 0.3em;
    border-radius: 4px;
    margin-left: .2rem;
    width: 80px;

    &:focus {
      border-color: ${props => hexToRgb(props.color, 0.3)};
    }
  }

  .react-tagsinput-remove {
    cursor: pointer;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.6);
  }

  .react-tagsinput-tag a::before {
    content: " ×";
  }
`;

export default props => (
  <Fragment>
    <GlobalStyle color={props.template.color()} />
    <TagsInput {...props} />
  </Fragment>
);
