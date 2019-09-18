import React from 'react';
import { Link as RouterLink, LinkProps } from '@reach/router';
import { LocationDescriptor } from 'history';

export interface ILinkProps {
  to?: LocationDescriptor;
  external?: boolean;
}

export const Link: React.FC<LinkProps> = React.forwardRef<
  HTMLAnchorElement,
  ILinkProps
>(({ to = undefined, external = false, children, ...props }, ref) =>
  external ? (
    <a ref={ref} {...props} href={to as string} target="_blank" rel="noopener">
      {children}
    </a>
  ) : (
    <RouterLink innerRef={ref} to={to} {...props}>
      {children}
    </RouterLink>
  )
);
