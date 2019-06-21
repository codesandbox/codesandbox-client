import React from 'react';

import { Added, Modified, Deleted } from '../Changes';

type Props = {
  gitChanges: any;
  hideColor?: boolean;
};

export const TotalChanges = ({ gitChanges, hideColor }: Props) => (
  <>
    <Added changes={gitChanges.added} hideColor={hideColor} />

    <Modified changes={gitChanges.modified} hideColor={hideColor} />

    <Deleted changes={gitChanges.deleted} hideColor={hideColor} />
  </>
);

TotalChanges.defaultProps = {
  gitChanges: {},
};
