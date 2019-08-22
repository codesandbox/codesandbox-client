import React from 'react';
import { Props as ButtonProps } from '../Button';
import { Loader, RelativeButton } from './elements';

type Props = ButtonProps & {
  loading?: boolean;
};

function ProgressButton({
  loading = false,
  disabled = false,
  ...props
}: Props) {
  return (
    <RelativeButton disabled={disabled || loading} {...props}>
      {props.children}
      {loading && <Loader />}
    </RelativeButton>
  );
}

export default ProgressButton;
