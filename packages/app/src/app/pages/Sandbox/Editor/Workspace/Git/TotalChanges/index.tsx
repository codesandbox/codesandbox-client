import * as React from 'react';
import { Added, Modified, Deleted } from '../Changes';
import { GitChanges } from 'app/store/modules/git/types'

type Props = {
  gitChanges: GitChanges
  hideColor?: boolean
}

const TotalChanges: React.SFC<Props> = ({ gitChanges, hideColor }) => {
  return (
    <div>
      <Added changes={gitChanges.added} hideColor={hideColor} />
      <Modified changes={gitChanges.modified} hideColor={hideColor} />
      <Deleted changes={gitChanges.deleted} hideColor={hideColor} />
    </div>
  );
}

export default TotalChanges;
