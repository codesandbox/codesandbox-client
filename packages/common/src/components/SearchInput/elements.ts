import styled from 'styled-components';
import {
  unstable_Form as Form,
  unstable_FormSubmitButton as FormSubmitButton,
} from 'reakit/Form';
import { FormInput } from '../FormInput';

export const SearchForm = styled(Form)`
  position: relative;
  width: 100%;
`;

export const SearchButton = styled(FormSubmitButton)`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 0px 4px 0px 0px;
  border: none;
  background: none;
  color: #999999;
  font-size: 16px;
  line-height: 32px;
  user-select: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover,
  &:focus {
    color: #fff;
  }
`;

export const Input = styled(FormInput)`
  position: relative;
  padding: 4px 6px 4px 32px;
`;
