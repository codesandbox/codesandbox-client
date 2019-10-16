import React from 'react';
import { Link } from 'react-router-dom';

interface IConfirmLinkProps {
  enabled: boolean;
  message: string;
  to: string;
}

export const ConfirmLink: React.FC<IConfirmLinkProps> = ({
  enabled,
  message,
  ...props
}) => (
  <Link
    to=""
    onClick={(e: React.MouseEvent) => {
      if (enabled && !confirm(message)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }}
    {...props}
  />
);
