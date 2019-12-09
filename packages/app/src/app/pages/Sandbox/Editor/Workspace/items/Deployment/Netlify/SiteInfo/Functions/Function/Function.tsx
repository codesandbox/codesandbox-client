import { Module } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import LightningIcon from 'react-icons/lib/md/flash-on';

import { useOvermind } from 'app/overmind';

import { Link } from '../../../../elements';

type Props = {
  function: Module;
};
export const Function: FunctionComponent<Props> = ({ function: { title } }) => {
  const {
    state: {
      deployment: {
        building,
        netlifySite: { url: siteUrl },
      },
    },
  } = useOvermind();
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
};
