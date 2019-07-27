import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface ILinkProps {
  to?: any;
  external?: boolean;
}

export const Link: React.FC<ILinkProps> = React.forwardRef<
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
