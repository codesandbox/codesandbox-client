import React from 'react';
import { useOvermind } from 'app/overmind';
import { useHistory, useLocation } from 'react-router-dom';
import {
  sandboxUrl,
  dashboard,
} from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import { Stack, Menu, Icon, Text } from '@codesandbox/components';
import {
  DashboardSandbox,
  DashboardTemplate,
  DashboardFolder,
  DashboardRepo,
} from '../../types';

interface IMenuProps {
  visible: boolean;
  position: { x: null | number; y: null | number };
  setVisibility: null | ((value: boolean) => void);
}

const Context = React.createContext<IMenuProps>({
  visible: false,
  setVisibility: null,
  position: { x: null, y: null },
});

interface IContextMenuProps extends IMenuProps {
  selectedIds: string[];
  sandboxes: Array<DashboardSandbox | DashboardTemplate>;
  folders: Array<DashboardFolder>;
  repos?: Array<DashboardRepo>;
  setRenaming: null | ((value: boolean) => void);
  createNewFolder: () => void;
  createNewSandbox: () => void;
}

export const ContextMenu: React.FC<IContextMenuProps> = ({
  visible,
  position,
  setVisibility,
  selectedIds,
  sandboxes,
  folders,
  repos,
  setRenaming,
  createNewFolder,
  createNewSandbox,
}) => {
  if (!visible) return null;

  const selectedItems: Array<
    DashboardFolder | DashboardSandbox | DashboardTemplate | DashboardRepo
  > = selectedIds.map(id => {
    if (id.startsWith('/')) {
      if (repos.length) {
        const repo = repos.find(f => '/' + f.name === id);
        return { type: 'repo', ...repo };
      }

      const folder = folders.find(f => f.path === id);
      return { type: 'folder', ...folder };
    }
    const sandbox = sandboxes.find(s => s.sandbox.id === id);
    return sandbox;
  });

  let menu: React.ReactNode;

  if (selectedItems.length === 0) {
    menu = (
      <ContainerMenu
        createNewSandbox={createNewSandbox}
        createNewFolder={createNewFolder}
      />
    );
  } else if (selectedItems.length > 1) {
    menu = <MultiMenu selectedItems={selectedItems} />;
  } else if (
    selectedItems[0].type === 'sandbox' ||
    selectedItems[0].type === 'template'
  ) {
    menu = <SandboxMenu item={selectedItems[0]} setRenaming={setRenaming} />;
  } else if (selectedItems[0].type === 'folder') {
    menu = <FolderMenu folder={selectedItems[0]} setRenaming={setRenaming} />;
  } else if (selectedItems[0].type === 'repo') {
    menu = <RepoMenu repo={selectedItems[0]} />;
  }

  return (
    <Context.Provider value={{ visible, setVisibility, position }}>
      {menu}
    </Context.Provider>
  );
};

const MenuItem = ({ onSelect, ...props }) => {
  const { setVisibility } = React.useContext(Context);
  return (
    <Menu.Item
      onSelect={() => {
        onSelect();
        setVisibility(false);
      }}
      {...props}
    />
  );
};

interface ContainerMenuProps {
  createNewFolder: () => void;
  createNewSandbox: () => void;
}

const ContainerMenu: React.FC<ContainerMenuProps> = ({
  createNewFolder,
  createNewSandbox,
}) => {
  const { visible, setVisibility, position } = React.useContext(Context);

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 160 }}
    >
      <MenuItem onSelect={() => createNewSandbox()}>
        Create new sandbox
      </MenuItem>
      <MenuItem onSelect={() => createNewFolder()}>Create new folder</MenuItem>
    </Menu.ContextMenu>
  );
};

interface SandboxMenuProps {
  item: DashboardSandbox | DashboardTemplate;
  setRenaming: (value: boolean) => void;
}
const SandboxMenu: React.FC<SandboxMenuProps> = ({ item, setRenaming }) => {
  const {
    state: { user, activeTeam },
    effects,
    actions,
  } = useOvermind();
  const { sandbox, type } = item;
  const isTemplate = type === 'template';

  const { visible, setVisibility, position } = React.useContext(Context);

  const history = useHistory();
  const location = useLocation();

  const url = sandboxUrl({
    id: sandbox.id,
    alias: sandbox.alias,
  });

  const folderUrl = getFolderUrl(item, activeTeam);

  const label = isTemplate ? 'template' : 'sandbox';
  const isOwner = React.useMemo(() => {
    if (item.type !== 'template') {
      return true;
    }
    return (
      item.sandbox.author && item.sandbox.author.username === user.username
    );
  }, [item, user]);

  if (location.pathname.includes('deleted')) {
    return (
      <Menu.ContextMenu
        visible={visible}
        setVisibility={setVisibility}
        position={position}
        style={{ width: 200 }}
      >
        <MenuItem
          onSelect={() => {
            actions.dashboard.recoverSandboxes([sandbox.id]);
          }}
        >
          Recover Sandbox
        </MenuItem>
        <MenuItem
          onSelect={() => {
            actions.dashboard.permanentlyDeleteSandboxes([sandbox.id]);
            setVisibility(false);
          }}
        >
          Delete Permanently
        </MenuItem>
      </Menu.ContextMenu>
    );
  }

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 200 }}
    >
      {isTemplate ? (
        <MenuItem
          onSelect={() => {
            actions.editor.forkExternalSandbox({
              sandboxId: sandbox.id,
              openInNewWindow: true,
            });
          }}
        >
          Fork Template
        </MenuItem>
      ) : null}
      <MenuItem onSelect={() => history.push(url)}>Open {label}</MenuItem>
      <MenuItem
        onSelect={() => {
          window.open(`https://codesandbox.io${url}`, '_blank');
        }}
      >
        Open {label} in new tab
      </MenuItem>
      {isOwner && folderUrl !== location.pathname ? (
        <MenuItem
          onSelect={() => {
            history.push(folderUrl, { sandboxId: sandbox.id });
          }}
        >
          Show in Folder
        </MenuItem>
      ) : null}
      <Menu.Divider />
      <MenuItem
        onSelect={() => {
          effects.browser.copyToClipboard(`https://codesandbox.io${url}`);
        }}
      >
        Copy {label} link
      </MenuItem>
      {!isTemplate ? (
        <MenuItem
          onSelect={() => {
            actions.editor.forkExternalSandbox({
              sandboxId: sandbox.id,
              openInNewWindow: true,
            });
          }}
        >
          Fork sandbox
        </MenuItem>
      ) : null}
      <MenuItem
        onSelect={() => {
          actions.dashboard.downloadSandboxes([sandbox.id]);
        }}
      >
        Export {label}
      </MenuItem>
      {isOwner ? (
        <>
          <Menu.Divider />
          {sandbox.privacy !== 0 && (
            <MenuItem
              onSelect={() =>
                actions.dashboard.changeSandboxPrivacy({
                  id: sandbox.id,
                  privacy: 0,
                  oldPrivacy: sandbox.privacy as 0 | 1 | 2,
                })
              }
            >
              Make {label} public
            </MenuItem>
          )}
          {sandbox.privacy !== 1 && (
            <MenuItem
              onSelect={() =>
                actions.dashboard.changeSandboxPrivacy({
                  id: sandbox.id,
                  privacy: 1,
                  oldPrivacy: sandbox.privacy as 0 | 1 | 2,
                })
              }
            >
              Make {label} unlisted
            </MenuItem>
          )}
          {sandbox.privacy !== 2 && (
            <MenuItem
              onSelect={() =>
                actions.dashboard.changeSandboxPrivacy({
                  id: sandbox.id,
                  privacy: 2,
                  oldPrivacy: sandbox.privacy as 0 | 1 | 2,
                })
              }
            >
              Make {label} private
            </MenuItem>
          )}
          <Menu.Divider />
          <MenuItem onSelect={() => setRenaming(true)}>Rename {label}</MenuItem>
          {isTemplate ? (
            <MenuItem
              onSelect={() => {
                actions.dashboard.unmakeTemplates({
                  templateIds: [sandbox.id],
                });
              }}
            >
              Convert to sandbox
            </MenuItem>
          ) : (
            <MenuItem
              onSelect={() => {
                actions.dashboard.makeTemplates({ sandboxIds: [sandbox.id] });
              }}
            >
              Make sandbox a template
            </MenuItem>
          )}
          <Menu.Divider />
          {isTemplate ? (
            <MenuItem
              onSelect={() => {
                const template = item as DashboardTemplate;
                actions.dashboard.deleteTemplate({
                  sandboxId: template.sandbox.id,
                  templateId: template.template.id,
                });
                setVisibility(false);
              }}
            >
              Delete template
            </MenuItem>
          ) : (
            <MenuItem
              onSelect={() => {
                actions.dashboard.deleteSandbox([sandbox.id]);
                setVisibility(false);
              }}
            >
              Delete sandbox
            </MenuItem>
          )}
        </>
      ) : null}
    </Menu.ContextMenu>
  );
};

const RepoMenu = ({ repo }) => {
  const { effects } = useOvermind();
  const { visible, setVisibility, position } = React.useContext(Context);
  const link = `https://github.com/${repo.owner}/${repo.name}/tree/${repo.branch}`;
  const csbLink = `https://codesandbox.io/s/github/${repo.owner}/${repo.name}/tree/${repo.branch}`;
  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 120 }}
    >
      <MenuItem onSelect={() => window.open(csbLink, '_blank')}>
        Open on CodeSandbox
      </MenuItem>
      <MenuItem
        onSelect={() => {
          effects.browser.copyToClipboard(link);
        }}
      >
        Copy GitHub URL
      </MenuItem>
      <MenuItem onSelect={() => window.open(link, '_blank')}>
        Open on GitHub
      </MenuItem>
    </Menu.ContextMenu>
  );
};

const FolderMenu = ({ folder, setRenaming }) => {
  const { actions } = useOvermind();
  const { visible, setVisibility, position } = React.useContext(Context);

  const isDrafts = folder.path === '/drafts';

  if (isDrafts)
    return (
      <Menu.ContextMenu
        visible={visible}
        setVisibility={setVisibility}
        position={position}
        style={{ width: 120 }}
      >
        <MenuItem onSelect={() => {}}>
          <Stack gap={1}>
            <Icon name="lock" size={14} />
            <Text>Protected</Text>
          </Stack>
        </MenuItem>
      </Menu.ContextMenu>
    );

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 120 }}
    >
      <MenuItem onSelect={() => setRenaming(true)}>Rename folder</MenuItem>
      <MenuItem
        onSelect={() => {
          actions.dashboard.deleteFolder({ path: folder.path });
          setVisibility(false);
          track('Dashboard - Delete folder', {
            source: 'Grid',
            dashboardVersion: 2,
          });
        }}
      >
        Delete folder
      </MenuItem>
    </Menu.ContextMenu>
  );
};

interface IMultiMenuProps {
  selectedItems: Array<
    DashboardSandbox | DashboardTemplate | DashboardFolder | DashboardRepo
  >;
}

const MultiMenu = ({ selectedItems }: IMultiMenuProps) => {
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
      actions.dashboard.deleteSandbox(
        sandboxes.map(sandbox => sandbox.sandbox.id)
      );
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

const getFolderUrl = (
  item: DashboardSandbox | DashboardTemplate,
  activeTeamId: string | null
) => {
  if (item.type === 'template') return dashboard.templates(activeTeamId);

  const path = item.sandbox.collection?.path;
  if (path == null || (!item.sandbox.teamId && path === '/')) {
    return dashboard.drafts(activeTeamId);
  }

  return dashboard.allSandboxes(path || '/', activeTeamId);
};
