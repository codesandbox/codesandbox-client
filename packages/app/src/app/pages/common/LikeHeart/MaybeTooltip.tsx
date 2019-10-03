import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React, { FunctionComponent } from 'react';

type Props = {
  disableTooltip?: boolean;
  loggedIn: boolean;
  title: string;
};
export const MaybeTooltip: FunctionComponent<Props> = ({
  children,
  disableTooltip = false,
  loggedIn,
  title,
}) =>
  loggedIn && !disableTooltip ? (
    <Tooltip content={title} style={{ display: 'flex' }}>
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  );
