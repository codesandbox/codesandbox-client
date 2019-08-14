import React from 'react';
import { Link } from 'react-router-dom';

interface IConfirmLinkProps {
  enabled: boolean;
  message: string;
}

const ConfirmLink: React.FC<IConfirmLinkProps> = ({
  enabled,
  message,
  ...props
}) => (
  <Link
    onClick={(e: React.MouseEvent) => {
      if (enabled && !confirm(message)) {
        // eslint-disable-line
        e.preventDefault();
        e.stopPropagation();
      }
    }}
    {...props}
  />
);

export default ConfirmLink;
