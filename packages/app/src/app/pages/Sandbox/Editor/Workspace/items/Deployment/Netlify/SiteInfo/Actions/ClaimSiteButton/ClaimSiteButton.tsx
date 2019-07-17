import { observer } from 'mobx-react-lite';
import React from 'react';

import { useStore } from 'app/store';

import { Link } from '../../../../elements';

export const ClaimSiteButton = observer(() => {
  const {
    deployment: { building, netlifyClaimUrl },
  } = useStore();

  return (
    <Link disabled={building} href={netlifyClaimUrl}>
      Claim Site
    </Link>
  );
});
