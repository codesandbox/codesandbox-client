import React from 'react';
import { Added, Modified, Deleted } from '../Changes';

function TotalChanges({ gitChanges, hideColor }) {
  return (
    <div>
      <Added changes={gitChanges.added} hideColor={hideColor} />
      <Modified changes={gitChanges.modified} hideColor={hideColor} />
      <Deleted changes={gitChanges.deleted} hideColor={hideColor} />
    </div>
  );
}

export default TotalChanges;
