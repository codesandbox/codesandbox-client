import { useOvermind } from 'app/overmind';
import saveAllModules from 'app/overmind/utils/saveAllModules';
import React, { FunctionComponent } from 'react';
import SaveIcon from 'react-icons/lib/md/save';

import { Action } from './Action';

const noop = () => undefined;
export const SaveAllButton: FunctionComponent = () => {
  const { actions, state } = useOvermind();
  const {
    editor: { isAllModulesSynced, changedModuleShortids },
  } = state;

  return (
    <Action
      onClick={isAllModulesSynced ? noop : () => saveAllModules(state, actions)}
      placeholder={isAllModulesSynced ? 'All modules are saved' : false}
      blink={changedModuleShortids.length > 2}
      title="Save"
      Icon={SaveIcon}
    />
  );
};
