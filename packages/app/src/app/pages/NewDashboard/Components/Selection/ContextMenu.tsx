import React from 'react';
import { useOvermind } from 'app/overmind';
import { useHistory, useLocation } from 'react-router-dom';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import { Stack, Menu, Icon, Text } from '@codesandbox/components';

const Context = React.createContext({ setVisibility: null });

export const ContextMenu = ({
  visible,
  position,
  setVisibility,
  selectedIds,
  sandboxes,
  folders,
  setRenaming,
  createNewFolder,
}) => {
  if (!visible) return null;

  const selectedItems = selectedIds.map(id => {
    if (id.startsWith('/')) {
      const folder = folders.find(f => f.path === id);
      return { type: 'folder', ...folder };
    }
    const sandbox = sandboxes.find(s => s.id === id);
    return { type: 'sandbox', ...sandbox };
  });

  let menu;
  let menuWidth;

  if (selectedItems.length === 0) {
    menu = <ContainerMenu createNewFolder={createNewFolder} />;
    menuWidth = 160;
  } else if (selectedItems.length > 1) {
    menu = (
      <MultiMenu selectedItems={selectedItems} setVisibility={setVisibility} />
    );
    menuWidth = 160;
  } else if (selectedItems[0].type === 'sandbox') {
    menu = (
      <SandboxMenu
        sandbox={selectedItems[0]}
        setRenaming={setRenaming}
        setVisibility={setVisibility}
      />
    );
    menuWidth = 200;
  } else if (selectedItems[0].type === 'folder') {
    menu = (
      <FolderMenu
        folder={selectedItems[0]}
        setRenaming={setRenaming}
        setVisibility={setVisibility}
      />
    );
    menuWidth = 120;
  }

  // tweak position to stay inside window
  const BOUNDARY_BUFFER = 8;

  const tweakedPosition = {
    x: Math.min(position.x, window.innerWidth - menuWidth - BOUNDARY_BUFFER),
    y: position.y,
  };

  return (
    <Context.Provider value={{ setVisibility }}>
      <Menu.ContextMenu
        visible={visible}
        setVisibility={setVisibility}
        position={tweakedPosition}
      >
        {menu}
      </Menu.ContextMenu>
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

const ContainerMenu = ({ createNewFolder }) => (
  <>
    <MenuItem onSelect={() => createNewFolder()}>Create new folder</MenuItem>
  </>
);

const SandboxMenu = ({
  sandbox,
  setRenaming,
  setVisibility,
}: {
  sandbox;
  setRenaming: (renaming: boolean) => void;
  setVisibility: (visible: boolean) => void;
}) => {
  const {
    state: { user },
    effects,
    actions,
  } = useOvermind();
  const history = useHistory();
  const location = useLocation();

  const url = sandboxUrl({
    id: sandbox.id,
    alias: sandbox.alias,
  });

  const folderUrl = getFolderUrl(sandbox);

  const label = sandbox.isTemplate ? 'template' : 'sandbox';
  const isOwner =
    !sandbox.isTemplate ||
    (sandbox.author && sandbox.author.username === user.username);

  if (location.pathname.includes('deleted')) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      {sandbox.isTemplate ? (
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
      {!sandbox.isTemplate ? (
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
                  oldPrivacy: sandbox.privacy,
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
                  oldPrivacy: sandbox.privacy,
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
                  oldPrivacy: sandbox.privacy,
                })
              }
            >
              Make {label} private
            </MenuItem>
          )}
          <Menu.Divider />
          <MenuItem onSelect={() => setRenaming(true)}>Rename {label}</MenuItem>
          {sandbox.isTemplate ? (
            <MenuItem
              onSelect={() => {
                actions.dashboard.unmakeTemplate([sandbox.id]);
              }}
            >
              Convert to sandbox
            </MenuItem>
          ) : (
            <MenuItem
              onSelect={() => {
                actions.dashboard.makeTemplate([sandbox.id]);
              }}
            >
              Make sandbox a template
            </MenuItem>
          )}
          <Menu.Divider />
          {sandbox.isTemplate ? (
            <MenuItem
              onSelect={() => {
                actions.dashboard.deleteTemplate({
                  sandboxId: sandbox.id,
                  templateId: sandbox.template.id,
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
    </>
  );
};

const FolderMenu = ({ folder, setRenaming, setVisibility }) => {
  const { actions } = useOvermind();

  const isDrafts = folder.path === '/drafts';

  if (isDrafts)
    return (
      <MenuItem>
        <Stack gap={1}>
          <Icon name="lock" size={14} />
          <Text>Protected</Text>
        </Stack>
      </MenuItem>
    );

  return (
    <>
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
    </>
  );
};

const MultiMenu = ({ selectedItems, setVisibility }) => {
  const { actions } = useOvermind();
  /*
    sandbox options - export, make template, delete
    template options - export, unmake template, delete
    folder options - delete

    sandboxes + templates - export, delete
    sandboxes + folders - delete
  */

  const folders = selectedItems.filter(item => item.type === 'folder');
  const templates = selectedItems.filter(item => item.isTemplate);
  const sandboxes = selectedItems.filter(
    item => item.type === 'sandbox' && !item.isTemplate
  );

  const exportItems = () => {
    const ids = [
      ...sandboxes.map(sandbox => sandbox.id),
      ...templates.map(template => template.id),
    ];
    actions.dashboard.downloadSandboxes(ids);
  };

  const convertToTemplates = () => {
    actions.dashboard.makeTemplate(sandboxes.map(sandbox => sandbox.id));
  };

  const convertToSandboxes = () => {
    actions.dashboard.unmakeTemplate(templates.map(template => template.id));
  };

  const deleteItems = () => {
    folders.forEach(folder =>
      actions.dashboard.deleteFolder({ path: folder.path })
    );

    templates.forEach(sandbox =>
      actions.dashboard.deleteTemplate({
        sandboxId: sandbox.id,
        templateId: sandbox.template.id,
      })
    );

    if (sandboxes.length) {
      actions.dashboard.deleteSandbox(sandboxes.map(sandbox => sandbox.id));
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
    <>
      {options.map(option => (
        <MenuItem key={option.label} onSelect={option.fn}>
          {option.label}
        </MenuItem>
      ))}
    </>
  );
};

const getFolderUrl = sandbox => {
  if (sandbox.isTemplate) return '/new-dashboard/templates';

  const path = sandbox.collection.path;
  if (path === '/' || !path) return '/new-dashboard/all/drafts';

  return '/new-dashboard/all' + path;
};
