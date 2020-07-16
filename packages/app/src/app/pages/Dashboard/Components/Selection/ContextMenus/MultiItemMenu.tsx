import React from 'react';
import { useOvermind } from 'app/overmind';
import { Menu } from '@codesandbox/components';
import { Context, MenuItem } from '../ContextMenu';
import {
  DashboardSandbox,
  DashboardTemplate,
  DashboardFolder,
  DashboardRepo,
  DashboardNewMasterBranch,
  PageTypes,
} from '../../../types';

interface IMultiMenuProps {
  selectedItems: Array<
    | DashboardSandbox
    | DashboardTemplate
    | DashboardFolder
    | DashboardRepo
    | DashboardNewMasterBranch
  >;
  page: PageTypes;
}

export const MultiMenu = ({ selectedItems, page }: IMultiMenuProps) => {
  const { actions } = useOvermind();
  const { visible, setVisibility, position } = React.useContext(Context);

  /*
    sandbox options - export, make template, delete
    template options - export, unmake template, delete
    folder options - delete

    sandboxes + templates - export, delete
    sandboxes + folders - delete
  */

  const folders = selectedItems.filter(
    item => item.type === 'folder'
  ) as DashboardFolder[];
  const templates = selectedItems.filter(
    item => item.type === 'template'
  ) as DashboardTemplate[];
  const sandboxes = selectedItems.filter(
    item => item.type === 'sandbox'
  ) as DashboardSandbox[];

  const exportItems = () => {
    const ids = [
      ...sandboxes.map(sandbox => sandbox.sandbox.id),
      ...templates.map(template => template.sandbox.id),
    ];
    actions.dashboard.downloadSandboxes(ids);
  };

  const convertToTemplates = () => {
    actions.dashboard.makeTemplates({
      sandboxIds: sandboxes.map(sandbox => sandbox.sandbox.id),
      page,
    });
  };

  const convertToSandboxes = () => {
    actions.dashboard.unmakeTemplates({
      templateIds: templates.map(template => template.sandbox.id),
    });
  };

  const deleteItems = () => {
    folders.forEach(folder =>
      actions.dashboard.deleteFolder({ path: folder.path })
    );

    templates.forEach(sandbox =>
      actions.dashboard.deleteTemplate({
        sandboxId: sandbox.sandbox.id,
        templateId: sandbox.template.id,
      })
    );

    if (sandboxes.length) {
      actions.dashboard.deleteSandbox({
        ids: sandboxes.map(sandbox => sandbox.sandbox.id),
        page,
      });
    }

    setVisibility(false);
  };

  const EXPORT = { label: 'Export items', fn: exportItems };
  const DELETE = { label: 'Delete items', fn: deleteItems };
  const CONVERT_TO_TEMPLATE = {
    label: 'Convert to templates',
    fn: convertToTemplates,
  };
  const CONVERT_TO_SANDBOX = {
    label: 'Convert to sandboxes',
    fn: convertToSandboxes,
  };

  let options = [];

  if (folders.length) {
    options = [DELETE];
  } else if (sandboxes.length && templates.length) {
    options = [EXPORT, DELETE];
  } else if (templates.length) {
    options = [EXPORT, CONVERT_TO_SANDBOX, DELETE];
  } else if (sandboxes.length) {
    options = [EXPORT, CONVERT_TO_TEMPLATE, DELETE];
  }

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 160 }}
    >
      {options.map(option => (
        <MenuItem key={option.label} onSelect={option.fn}>
          {option.label}
        </MenuItem>
      ))}
    </Menu.ContextMenu>
  );
};
