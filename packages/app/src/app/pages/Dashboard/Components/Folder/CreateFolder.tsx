import React from 'react';
import { join } from 'path';
import { useLocation } from 'react-router-dom';
import track from '@codesandbox/common/lib/utils/analytics';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { useAppState, useActions } from 'app/overmind';
import { FolderCard } from './FolderCard';
import { FolderListItem } from './FolderListItem';
import { DashboardNewFolder } from '../../types';

export const CreateFolder = ({ basePath, setCreating }: DashboardNewFolder) => {
  const {
    dashboard: { createFolder },
  } = useActions();
  const { dashboard } = useAppState();

  const location = useLocation();

  /* View logic */

  let viewMode: string;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else viewMode = dashboard.viewMode;

  const Component = viewMode === 'list' ? FolderListItem : FolderCard;

  /* Edit logic */
  const [newName, setNewName] = React.useState<string>('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESC) {
      setCreating(false);
    }
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    setCreating(false);
    if (newName && newName.trim()) {
      const newFolderPath = join('/', basePath, newName);

      track('Dashboard - Create Directory', {
        source: 'Grid',
        dashboardVersion: 2,
        folderPath: newFolderPath,
      });
      await createFolder(newFolderPath);
    }
  };

  const onInputBlur = () => {
    // save value when you click outside or tab away
    onSubmit();
  };

  const folderProps = {
    name: '',
    path: basePath,
    isDrafts: false,
    numberOfSandboxes: 0,
    editing: true,
    selected: true,
    isNewFolder: true,
    newName,
    onChange,
    onInputKeyDown,
    onSubmit,
    onInputBlur,
  };

  return <Component {...folderProps} />;
};
