import React from 'react';
import { Link as RouterLink } from '@reach/router';

export interface ILinkProps {
  to?: string;
  external?: boolean;
  innerRef: any;
}

export const Link = React.forwardRef<HTMLAnchorElement, ILinkProps>(
  ({ to = undefined, external = false, children, ...props }, ref) =>
    external ? (
      <a
        ref={ref}
        {...props}
        href={to as string}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ) : (
      <RouterLink innerRef={ref} to={to} {...props}>
        {children}
      </RouterLink>
    )
);
