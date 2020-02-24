import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';

const placeholderStyles = {
  color: 'input.placeholderForeground',
  fontSize: 3,
};

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = styled(Element).attrs({ as: 'input' })<IInputProps>(
  css({
    height: '26px',
    width: '100%',
    paddingX: 2,
    fontSize: 3,
    lineHeight: 1, // trust the height
    fontFamily: 'Inter, sans-serif',
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
