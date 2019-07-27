import React from 'react';
import { Button, IButtonProps } from '../Button';
import { Wrapper, Loader } from './elements';

interface IProgressButtonProps extends IButtonProps {
  loading?: boolean;
}

const ProgressButton: React.FC<IProgressButtonProps> = ({
  loading = false,
  disabled = false,
  ...props
}) => (
  <Wrapper>
    <Button disabled={disabled || loading} {...props} />
    {loading && <Loader />}
  </Wrapper>
);

export default ProgressButton;
