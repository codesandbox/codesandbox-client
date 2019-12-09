import React from 'react';
import LinkIcon from 'react-icons/lib/fa/external-link';

import { Link } from '../../../../elements';

export const VisitDeploymentButton = ({ url }) => (
  <Link href={`https://${url}`}>
    <LinkIcon /> <span>Visit</span>
  </Link>
);
