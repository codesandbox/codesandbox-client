import { observer } from 'mobx-react-lite';
import React from 'react';
import LightningIcon from 'react-icons/lib/md/flash-on';

import { useStore } from 'app/store';

import { Link } from '../../../../elements';

type Props = {
  function: {
    title: string;
  };
};
export const Function = observer<Props>(({ function: { title } }) => {
  const {
    deployment: {
      building,
      netlifySite: { url: siteUrl },
    },
  } = useStore();

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
});
