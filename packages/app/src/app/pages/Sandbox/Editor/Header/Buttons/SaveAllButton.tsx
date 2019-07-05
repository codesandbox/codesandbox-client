import React from 'react';
import { observer } from 'mobx-react-lite';
import SaveIcon from 'react-icons/lib/md/save';
import { useSignals, useStore } from 'app/store';
import { saveAllModules } from 'app/store/modules/editor/utils';
import { Action } from './Action';

export const SaveAllButton = observer(() => {
  const signals = useSignals();
  const store = useStore();
  const {
    editor: { isAllModulesSynced, changedModuleShortids },
  } = store;

  return (
    <Action
      onClick={isAllModulesSynced ? null : () => saveAllModules(store, signals)}
      placeholder={isAllModulesSynced ? 'All modules are saved' : false}
      blink={changedModuleShortids.length > 2}
      title="Save"
      Icon={SaveIcon}
    />
  );
});
