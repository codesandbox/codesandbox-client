import React from 'react';
import { Link } from 'react-router-dom';

interface IConfirmLinkProps {
  enabled: boolean;
  message: string;
}

const ConfirmLink = ({ enabled, message, ...props }: IConfirmLinkProps) => (
  <Link
    onClick={(e: React.MouseEvent) => {
      if (enabled && !confirm(message)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }}
    {...props}
  />
);

export default ConfirmLink;
