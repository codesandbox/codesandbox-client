import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface ILinkProps {
  to?: any;
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const Link: React.FC<ILinkProps> = React.forwardRef<
  HTMLAnchorElement,
  ILinkProps
>(({ to = undefined, external = false, onClick, children, ...props }, ref) =>
  external ? (
    <a
      ref={ref}
      {...props}
      href={to as string}
      onClick={onClick}
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
