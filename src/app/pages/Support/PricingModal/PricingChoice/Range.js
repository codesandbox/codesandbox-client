import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
  padding-top: 10px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;

    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    border: none;
    margin-top: -5px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 12px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 9px;
  }

  /* All the same stuff for Firefox */
  &::-moz-range-thumb {
    -webkit-appearance: none;

    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    border: none;
    margin-top: -10px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  /* All the same stuff for IE */
  &::-ms-thumb {
    -webkit-appearance: none;

    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    border: none;
    margin-top: -10px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  &::-ms-track {
    width: 100%;
    cursor: pointer;

    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  &::-moz-range-track {
    width: 100%;
    height: 12px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 9px;
  }

  &::-moz-range-progress {
    width: 100%;
    height: 12px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 9px;
    background-color: ${props => props.theme.secondary};
  }

  &::-ms-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }

  &::-ms-fill-lower {
    background: ${props => props.theme.secondary};
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }

  &::-ms-fill-upper {
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
`;

export default props => <Input type="range" {...props} />;
