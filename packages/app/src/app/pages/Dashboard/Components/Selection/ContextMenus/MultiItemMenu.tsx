import React from 'react';
import { useEffects, useActions, useAppState } from 'app/overmind';
import { Menu } from '@codesandbox/components';
import { SubscriptionType } from 'app/graphql/types';
import { Context, MenuItem } from '../ContextMenu';
import {
  DashboardSandbox,
  DashboardTemplate,
  DashboardFolder,
  DashboardRepo,
  DashboardNewMasterBranch,
  DashboardCommunitySandbox,
  PageTypes,
} from '../../../types';

interface IMultiMenuProps {
  selectedItems: Array<
    | DashboardSandbox
    | DashboardTemplate
    | DashboardFolder
    | DashboardRepo
    | DashboardNewMasterBranch
    | DashboardCommunitySandbox
  >;
  page: PageTypes;
}

type MenuAction =
  | 'divider'
  | {
      label: string;
      fn: () => void;
    };

export const MultiMenu = ({ selectedItems, page }: IMultiMenuProps) => {
  const state = useAppState();
  const actions = useActions();
  const { notificationToast } = useEffects();
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
      ...sandboxes
        .filter(sandbox => !sandbox.sandbox.permissions.preventSandboxExport)
        .map(sandbox => sandbox.sandbox.id),
      ...templates.map(template => template.sandbox.id),
    ];

    actions.dashboard.downloadSandboxes(ids);

    const skippedSandboxes = sandboxes.filter(
      sandbox => sandbox.sandbox.permissions.preventSandboxExport
    );

    if (skippedSandboxes.length) {
      notificationToast.error(
        `${skippedSandboxes.length} ${
          skippedSandboxes.length === 1 ? 'sandbox was' : 'sandboxes were'
        } skipped because you do not have permission to export ${
          skippedSandboxes.length === 1 ? 'it' : 'them'
        }.`
      );
    }
  };

  const convertToTemplates = () => {
    actions.dashboard.makeTemplates({
      sandboxIds: sandboxes.map(sandbox => sandbox.sandbox.id),
    });
  };

  const convertToSandboxes = () => {
    actions.dashboard.unmakeTemplates({
      templateIds: templates.map(template => template.sandbox.id),
    });
  };

  const moveToFolder = () => {
    actions.modals.moveSandboxModal.open({
      sandboxIds: [...sandboxes, ...templates].map(s => s.sandbox.id),
      preventSandboxLeaving: Boolean(
        [...sandboxes, ...templates].find(
          s => s.sandbox.permissions.preventSandboxLeaving
        )
      ),
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
      });
    }

    setVisibility(false);
  };

  const changeItemPrivacy = (privacy: 0 | 1 | 2) => () => {
    actions.dashboard.changeSandboxesPrivacy({
      sandboxIds: [...sandboxes, ...templates].map(s => s.sandbox.id),
      privacy,
    });
  };

  const DIVIDER = 'divider' as const;

  const MAKE_PUBLIC = { label: 'Make Items Public', fn: changeItemPrivacy(0) };
  const MAKE_UNLISTED = {
    label: 'Make Items Unlisted',
    fn: changeItemPrivacy(1),
  };
  const MAKE_PRIVATE = {
    label: 'Make Items Private',
    fn: changeItemPrivacy(2),
  };
  const PRIVACY_ITEMS = state.activeTeamInfo?.subscription
    ? [MAKE_PUBLIC, MAKE_UNLISTED, MAKE_PRIVATE, DIVIDER]
    : [];

  const FROZEN_ITEMS = [
    sandboxes.some(s => !s.sandbox.isFrozen) && {
      label: 'Freeze Sandboxes',
      fn: () => {
        actions.dashboard.changeSandboxesFrozen({
          sandboxIds: sandboxes.map(sandbox => sandbox.sandbox.id),
          isFrozen: true,
        });
      },
    },
    sandboxes.some(s => s.sandbox.isFrozen) && {
      label: 'Unfreeze Sandboxes',
      fn: () => {
        actions.dashboard.changeSandboxesFrozen({
          sandboxIds: sandboxes.map(sandbox => sandbox.sandbox.id),
          isFrozen: false,
        });
      },
    },
  ].filter(Boolean);

  const isTeamPro =
    state.activeTeamInfo?.subscription?.type === SubscriptionType?.TeamPro;

  const PROTECTED_SANDBOXES_ITEMS =
    isTeamPro && state.activeWorkspaceAuthorization === 'ADMIN'
      ? [
          sandboxes.some(s => !s.sandbox.permissions.preventSandboxLeaving) && {
            label: 'Prevent Leaving Workspace',
            fn: () => {
              actions.dashboard.setPreventSandboxesLeavingWorkspace({
                sandboxIds: sandboxes.map(sandbox => sandbox.sandbox.id),
                preventSandboxLeaving: true,
              });
            },
          },
          sandboxes.some(s => s.sandbox.permissions.preventSandboxLeaving) && {
            label: 'Allow Leaving Workspace',
            fn: () => {
              actions.dashboard.setPreventSandboxesLeavingWorkspace({
                sandboxIds: sandboxes.map(sandbox => sandbox.sandbox.id),
                preventSandboxLeaving: false,
              });
            },
          },
          sandboxes.some(s => !s.sandbox.permissions.preventSandboxExport) && {
            label: 'Prevent Export as .zip',
            fn: () => {
              actions.dashboard.setPreventSandboxesExport({
                sandboxIds: sandboxes.map(sandbox => sandbox.sandbox.id),
                preventSandboxExport: true,
              });
            },
          },
          sandboxes.some(s => s.sandbox.permissions.preventSandboxExport) && {
            label: 'Allow Export as .zip',
            fn: () => {
              actions.dashboard.setPreventSandboxesExport({
                sandboxIds: sandboxes.map(sandbox => sandbox.sandbox.id),
                preventSandboxExport: false,
              });
            },
          },
        ].filter(Boolean)
      : [];

  const EXPORT = sandboxes.some(
    s => !s.sandbox.permissions.preventSandboxExport
  )
    ? [{ label: 'Export Items', fn: exportItems }]
    : [];

  const DELETE = { label: 'Archive Items', fn: deleteItems };
  const RECOVER = {
    label: 'Recover Sandboxes',
    fn: () => {
      actions.dashboard.recoverSandboxes(
        [...sandboxes, ...templates].map(s => s.sandbox.id)
      );
    },
  };
  const PERMANENTLY_DELETE = {
    label: 'Permanently Delete Sandboxes',
    fn: () => {
      actions.dashboard.permanentlyDeleteSandboxes(
        [...sandboxes, ...templates].map(s => s.sandbox.id)
      );
    },
  };
  const CONVERT_TO_TEMPLATE = {
    label: 'Convert to Templates',
    fn: convertToTemplates,
  };
  const CONVERT_TO_SANDBOX = {
    label: 'Convert to Sandboxes',
    fn: convertToSandboxes,
  };
  const MOVE_ITEMS = {
    label: 'Move to Folder',
    fn: moveToFolder,
  };

  let options: MenuAction[] = [];

  if (page === 'archive') {
    options = [RECOVER, DIVIDER, PERMANENTLY_DELETE];
  } else if (folders.length) {
    options = [DELETE];
  } else if (sandboxes.length && templates.length) {
    options = [...PRIVACY_ITEMS, ...EXPORT, MOVE_ITEMS, DIVIDER, DELETE];
  } else if (templates.length) {
    options = [
      ...PRIVACY_ITEMS,
      ...EXPORT,
      MOVE_ITEMS,
      CONVERT_TO_SANDBOX,
      DIVIDER,
      DELETE,
    ];
  } else if (sandboxes.length) {
    options = [
      ...PRIVACY_ITEMS,
      ...EXPORT,
      DIVIDER,
      ...FROZEN_ITEMS,
      DIVIDER,
      MOVE_ITEMS,
      CONVERT_TO_TEMPLATE,
      ...PROTECTED_SANDBOXES_ITEMS,
      DIVIDER,
      DELETE,
    ];
  }

  return options.length > 0 ? (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 160 }}
    >
      {options.map(option =>
        option === 'divider' ? (
          <Menu.Divider />
        ) : (
          <MenuItem key={option.label} onSelect={option.fn}>
            {option.label}
          </MenuItem>
        )
      )}
    </Menu.ContextMenu>
  ) : null;
};
