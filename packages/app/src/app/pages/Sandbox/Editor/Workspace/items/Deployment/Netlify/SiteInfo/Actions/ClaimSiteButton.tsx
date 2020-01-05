import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Link } from '../../../elements';

export const ClaimSiteButton: FunctionComponent = () => {
  const {
    state: {
      deployment: { building, netlifyClaimUrl },
    },
  } = useOvermind();

  return (
    <Link disabled={building} href={netlifyClaimUrl}>
      Claim Site
    </Link>
  );
};
