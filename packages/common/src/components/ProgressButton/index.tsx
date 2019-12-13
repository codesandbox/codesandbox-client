import React, { ComponentProps, FunctionComponent } from 'react';
import { Button } from '../Button';
import { Wrapper, Loader } from './elements';

type Props = ComponentProps<typeof Button> & {
  loading?: boolean;
};
const ProgressButton: FunctionComponent<Props> = ({
  disabled = false,
  loading = false,
  ...props
}) => (
  <Wrapper>
    <Button disabled={disabled || loading} {...props} />
    {loading && <Loader />}
  </Wrapper>
);

export default ProgressButton;
