import React from 'react';
import { Link } from 'react-router-dom';

interface IConfirmLinkProps {
  enabled: boolean;
  message: string;
}

export const ConfirmLink: React.FC<IConfirmLinkProps> = ({
  enabled,
  message,
  ...props
}) => (
  <Link
    onClick={(e: React.MouseEvent) => {
      // eslint-disable-next-line
      if (enabled && !confirm(message)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }}
    {...props}
  />
);
