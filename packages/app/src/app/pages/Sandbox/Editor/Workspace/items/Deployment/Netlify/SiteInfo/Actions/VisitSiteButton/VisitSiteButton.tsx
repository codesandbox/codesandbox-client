import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';
import LinkIcon from 'react-icons/lib/fa/external-link';
import Cogs from 'react-icons/lib/fa/cogs';

import { Link } from '../../../../elements';

export const VisitSiteButton = inject('store')(
  hooksObserver(({ store: { deployment: { building, netlifySite } } }) => (
    <Link disabled={building} href={netlifySite.url}>
      {building ? (
        <>
          <Cogs /> Building...
        </>
      ) : (
        <>
          <LinkIcon /> Visit
        </>
      )}
    </Link>
  ))
);
