import React from 'react';
import { Button, Props as ButtonProps } from '../Button';
import { Wrapper, Loader } from './elements';

type Props = ButtonProps & {
  loading?: boolean;
};

function ProgressButton({
  loading = false,
  disabled = false,
  ...props
}: Props) {
  return (
    <Wrapper>
      <Button disabled={disabled || loading} {...props} />
      {loading && <Loader />}
    </Wrapper>
  );
}

export default ProgressButton;
