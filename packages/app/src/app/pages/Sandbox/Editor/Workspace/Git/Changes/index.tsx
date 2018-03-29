import * as React from 'react';

import theme from 'common/theme';

import AddedIcon from 'react-icons/lib/go/diff-added';
import ModifiedIcon from 'react-icons/lib/go/diff-modified';
import RemovedIcon from 'react-icons/lib/go/diff-removed';

import Tooltip from 'common/components/Tooltip';

import { ChangeContainer, Entry } from './elements';

type ChangesProps = {
  changes: string[]
  color: string
  Icon: React.ComponentClass
  title: string
  hideColor: boolean
}

const Changes: React.SFC<ChangesProps> = ({ changes, color, Icon, title, hideColor }) => {
  return (
    <div>
      {changes.sort().map(change => (
        <ChangeContainer key={change} color={color}>
          <Entry hideColor={hideColor} editing color={color}>
            <Tooltip title={title}>
              <Icon />
            </Tooltip>
            {change}
          </Entry>
        </ChangeContainer>
      ))}
    </div>
  );
}

type AddedProps = {
  changes: string[]
  hideColor: boolean
}

export const Added: React.SFC<AddedProps> = ({ changes, hideColor }) => {
  return (
    <Changes
      changes={changes}
      color={theme.green}
      Icon={AddedIcon}
      title="Added"
      hideColor={hideColor}
    />
  );
}

type ModifiedProps = {
  changes: string[]
  hideColor: boolean
}

export const Modified: React.SFC<ModifiedProps> = ({ changes, hideColor }) => {
  return (
    <Changes
      changes={changes}
      color={theme.secondary}
      Icon={ModifiedIcon}
      title="Modified"
      hideColor={hideColor}
    />
  );
}

type DeletedProps = {
  changes: string[]
  hideColor: boolean
}

export const Deleted: React.SFC<DeletedProps> = ({ changes, hideColor }) => {
  return (
    <Changes
      changes={changes}
      color={theme.red}
      Icon={RemovedIcon}
      title="Deleted"
      hideColor={hideColor}
    />
  );
}

export default Changes;
