import React from 'react';
import { hooksObserver, inject } from 'app/componentConnectors';
import SaveIcon from 'react-icons/lib/md/save';
import { saveAllModules } from 'app/store/modules/editor/utils';
import { Action } from './Action';

export const SaveAllButton = inject('store', 'signals')(
  hooksObserver(({ store, signals }) => {
    const {
      editor: { isAllModulesSynced, changedModuleShortids },
    } = store;

    return (
      <Action
        onClick={
          isAllModulesSynced ? null : () => saveAllModules(store, signals)
        }
        placeholder={isAllModulesSynced ? 'All modules are saved' : false}
        blink={changedModuleShortids.length > 2}
        title="Save"
        Icon={SaveIcon}
      />
    );
  })
);
