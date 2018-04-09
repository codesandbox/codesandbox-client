import * as React from 'react';
import { GitChanges } from 'app/store/modules/git/types';
import { Added, Modified, Deleted } from '../Changes';

export type Props = {
  gitChanges: GitChanges;
  hideColor?: boolean;
};

const TotalChanges: React.SFC<Props> = ({ gitChanges, hideColor }) => (
  <div>
    <Added changes={gitChanges.added} hideColor={hideColor} />
    <Modified changes={gitChanges.modified} hideColor={hideColor} />
    <Deleted changes={gitChanges.deleted} hideColor={hideColor} />
  </div>
);

export default TotalChanges;
