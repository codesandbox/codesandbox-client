import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';
import LightningIcon from 'react-icons/lib/md/flash-on';
import { Link } from '../../../../elements';

type Props = {
  function: {
    title: string;
  };
  store: any;
};
export const Function = inject('store')(
  hooksObserver(
    ({
      function: { title },
      store: {
        deployment: {
          building,
          netlifySite: { url: siteUrl },
        },
      },
    }: Props) => {
      const functionName = title.split('.js')[0];

      return (
        <Link
          disabled={building}
          href={`${siteUrl}/.netlify/functions/${functionName}`}
        >
          <LightningIcon />

          {functionName}
        </Link>
      );
    }
  )
);
