import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import VisuallyHidden from '@reach/visually-hidden';
import { uniqueId } from 'lodash-es';
import { Text } from '../Text';

export const SelectComponent = styled.select(
  css({
    width: '100%',
    height: 6,
    paddingX: 2,
    fontSize: 3,
    borderRadius: 'small',
    backgroundColor: 'input.background',
    border: '1px solid',
    borderColor: 'input.border',
    color: 'input.placeholderForeground',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='24' viewBox='0 0 8 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.00006 17L1 13L7 13L4.00006 17Z' fill='%23757575'/%3E%3Cpath d='M3.99994 7L7 11H1L3.99994 7Z' fill='%23757575'/%3E%3C/svg%3E%0A")`,
    backgroundPosition: 'calc(100% - 8px) center',
    backgroundRepeat: 'no-repeat',
  })
);

interface ISelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<ISelectProps> = ({
  label,
  children,
  ...props
}) => {
  const id = props.id || uniqueId('form_');

  return (
    <>
      {props.placeholder && !label ? (
        <VisuallyHidden>
          <label htmlFor={id}>{props.placeholder}</label>
        </VisuallyHidden>
      ) : null}
      <Text
        as="label"
        size={2}
        marginBottom={2}
        htmlFor={id}
        style={{ display: 'block' }}
      >
        {label}
      </Text>
      <SelectComponent id={id} {...props}>
        {props.placeholder ? (
          <option value="" disabled selected>
            {props.placeholder}
          </option>
        ) : null}
        {children}
      </SelectComponent>
    </>
  );
};
