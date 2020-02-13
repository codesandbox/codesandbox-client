import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';

const placeholderStyles = {
  color: 'input.placeholderForeground',
  fontSize: 3,
};

export const Input = styled(Element).attrs({ as: 'input' })<{
  type?: string;
  onBlur?: any;
  onChange?: any;
  onKeyUp?: any;
  placeholder?: string;
  ref?: any;
  required?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  autoComplete?: 'on' | 'off';
  spellCheck?: 'true' | 'false';
  autoFocus?: boolean;
}>(
  css({
    height: '26px',
    width: '100%',
    paddingX: 2,
    fontSize: 3,
    borderRadius: 'small',
    backgroundColor: 'input.background',
    border: '1px solid',
    borderColor: 'input.border',
    color: 'input.foreground',
    '::-webkit-input-placeholder': placeholderStyles,
    '::-ms-input-placeholder': placeholderStyles,
    '::placeholder': placeholderStyles,
    transition: 'all ease',
    transitionDuration: theme => theme.speeds[2],

    ':hover, :focus': {
      borderColor: 'inputOption.activeBorder',
      // need to use !important to override styles from
      // workbench-theme.css, not proud :/
      outline: 'none !important',
    },
    ':disabled': {
      opacity: 0.4,
      borderColor: 'input.border', // (default border)
    },
  })
);
