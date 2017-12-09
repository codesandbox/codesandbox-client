// @flow
import * as React from 'react';

import Preferences from 'app/containers/Preferences';

import SearchDependencies from 'app/pages/Sandbox/Editor/Workspace/Dependencies/SearchDependencies';
import sandboxActions from 'app/store/entities/sandboxes/actions';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

const openModal = ({
  Body,
  title,
  width,
  preventClosing,
  preventEscapeClosing,
}: {
  Body: React.Element<any>,
  title?: string,
  width?: number,
  preventClosing?: boolean,
  preventEscapeClosing?: boolean,
}) => ({
  type: OPEN_MODAL,
  title,
  width,
  Body,
  preventClosing,
  preventEscapeClosing,
});

const closeModal = () => ({ type: CLOSE_MODAL });

const openPreferences = (pane: ?string) => (dispatch: Function) =>
  dispatch(
    openModal({
      Body: <Preferences initialPane={pane} />,
      preventEscapeClosing: true,
      width: 900,
    })
  );

const openSearchDependencies = (sandboxId: string) => (dispatch: Function) => {
  const onConfirm = (name: string, version: string) => {
    if (name) {
      dispatch(sandboxActions.addNPMDependency(sandboxId, name, version));
      dispatch(closeModal());
    }
  };

  dispatch(
    openModal({
      width: 600,
      Body: <SearchDependencies onConfirm={onConfirm} />,
    })
  );
};

export default {
  openModal,
  closeModal,
  openPreferences,
  openSearchDependencies,
};
