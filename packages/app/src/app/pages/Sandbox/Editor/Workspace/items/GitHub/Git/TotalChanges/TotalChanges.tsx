import React from 'react';
import { Added, Modified, Deleted } from '../Changes';

export const TotalChanges = ({
  gitChanges,
  hideColor,
}: {
  gitChanges: any;
  hideColor?: boolean;
}) => (
  <>
    <Added changes={gitChanges.added} hideColor={hideColor} />
    <Modified changes={gitChanges.modified} hideColor={hideColor} />
    <Deleted changes={gitChanges.deleted} hideColor={hideColor} />
  </>
);
