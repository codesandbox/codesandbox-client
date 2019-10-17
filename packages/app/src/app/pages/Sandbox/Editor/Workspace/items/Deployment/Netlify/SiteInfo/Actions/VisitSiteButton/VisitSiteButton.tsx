import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import LinkIcon from 'react-icons/lib/fa/external-link';
import Cogs from 'react-icons/lib/fa/cogs';

import { Link } from '../../../../elements';

export const VisitSiteButton: FunctionComponent = () => {
  const {
    state: {
      deployment: {
        building,
        netlifySite: { url },
      },
    },
  } = useOvermind();

  return (
    <Link disabled={building} href={url}>
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
