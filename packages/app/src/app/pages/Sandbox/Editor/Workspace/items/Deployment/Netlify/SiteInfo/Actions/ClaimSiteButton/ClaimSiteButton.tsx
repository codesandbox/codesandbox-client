import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';

import { Link } from '../../../../elements';

export const ClaimSiteButton = inject('store')(
  hooksObserver(({ store: { deployment: { building, netlifyClaimUrl } } }) => (
    <Link disabled={building} href={netlifyClaimUrl}>
      Claim Site
    </Link>
  ))
);
