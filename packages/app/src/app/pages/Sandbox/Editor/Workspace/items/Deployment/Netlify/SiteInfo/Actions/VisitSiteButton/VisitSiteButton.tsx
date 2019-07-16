import React from 'react';
import LinkIcon from 'react-icons/lib/fa/external-link';
import Cogs from 'react-icons/lib/fa/cogs';

import { useStore } from 'app/store';

import { Link } from '../../../../elements';

export const VisitSiteButton = () => {
  const {
    deployment: { building, netlifySite },
  } = useStore();

  return (
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
  );
};
