import React from 'react';
import { useOvermind } from 'app/overmind';
import { useHistory, useLocation } from 'react-router-dom';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { Stack, Element, Menu, Icon, Text } from '@codesandbox/components';
import css from '@styled-system/css';

export const ContextMenu = ({
  visible,
  position,
  setVisibility,
  selectedIds,
  sandboxes,
  folders,
  setRenaming,
}) => {
  React.useEffect(() => {
    // close when user clicks outside or scrolls away
    const handler = () => {
      if (visible) setVisibility(false);
    };

    document.addEventListener('click', handler);
    document.addEventListener('scroll', handler, true);
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('scroll', handler, true);
    };
  }, [visible, setVisibility]);

  // handle key down events - close on escape + disable the rest
  // TODO: handle arrow keys and space/enter.
  React.useEffect(() => {
    const handler = event => {
      if (!visible) return;
      if (event.keyCode === ESC) setVisibility(false);
      event.preventDefault();
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  });

  if (!visible || selectedIds.length === 0) return null;

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
  if (selectedItems.length > 1) {
    menu = <MultiMenu selectedItems={selectedItems} />;
    menuWidth = 160;
  } else if (selectedItems[0].type === 'sandbox') {
    menu = <SandboxMenu sandbox={selectedItems[0]} setRenaming={setRenaming} />;
    menuWidth = 200;
  } else if (selectedItems[0].type === 'folder') {
    menu = <FolderMenu folder={selectedItems[0]} setRenaming={setRenaming} />;
    menuWidth = 120;
  }

  // tweak position to stay inside window
  const BOUNDARY_BUFFER = 8;

  const tweakedPosition = {
    x: Math.min(position.x, window.innerWidth - menuWidth - BOUNDARY_BUFFER),
    y: position.y,
  };

  return (
    <>
      <Stack
        direction="vertical"
        data-reach-menu-list
        data-component="MenuList"
        css={css({
          position: 'absolute',
          width: menuWidth,
          top: tweakedPosition.y,
          left: tweakedPosition.x,
        })}
      >
        {menu}
      </Stack>
    </>
  );
};

const MenuItem = props => (
  <Element data-reach-menu-item="" data-component="MenuItem" {...props} />
);

const SandboxMenu = ({
  sandbox,
  setRenaming,
}: {
  sandbox;
  setRenaming: (renaming: boolean) => void;
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

  const getFolderUrl = () => {
    if (sandbox.isTemplate) return '/new-dashboard/templates';

    const path = sandbox.collection.path;
    if (path === '/' || !path) return '/new-dashboard/all/drafts';

    return '/new-dashboard/all' + path;
  };

  const label = sandbox.isTemplate ? 'template' : 'sandbox';
  const isOwner =
    !sandbox.isTemplate ||
    (sandbox.author && sandbox.author.username === user.username);

  if (location.pathname.includes('deleted')) {
    return (
      <>
        <MenuItem
          onClick={() => {
            actions.dashboard.recoverSandboxes([sandbox.id]);
          }}
        >
          Recover Sandbox
        </MenuItem>
        <MenuItem
          onClick={() => {
            actions.dashboard.permanentlyDeleteSandboxes([sandbox.id]);
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
          onClick={() => {
            actions.editor.forkExternalSandbox({
              sandboxId: sandbox.id,
              openInNewWindow: true,
            });
          }}
        >
          Fork Template
        </MenuItem>
      ) : null}
      <MenuItem onClick={() => history.push(url)}>Open {label}</MenuItem>
      <MenuItem
        onClick={() => {
          window.open(`https://codesandbox.io${url}`, '_blank');
        }}
      >
        Open {label} in new tab
      </MenuItem>
      {isOwner && getFolderUrl() !== location.pathname ? (
        <MenuItem
          onClick={() => {
            history.push(getFolderUrl(), { sandboxId: sandbox.id });
          }}
        >
          Show in Folder
        </MenuItem>
      ) : null}
      <Menu.Divider />
      <MenuItem
        onClick={() => {
          effects.browser.copyToClipboard(`https://codesandbox.io${url}`);
        }}
      >
        Copy {label} link
      </MenuItem>
      {!sandbox.isTemplate ? (
        <MenuItem
          onClick={() => {
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
        onClick={() => {
          actions.dashboard.downloadSandboxes([sandbox.id]);
        }}
      >
        Export {label}
      </MenuItem>
      {isOwner ? (
        <>
          <Menu.Divider />
          <MenuItem onClick={() => setRenaming(true)}>Rename {label}</MenuItem>
          {sandbox.isTemplate ? (
            <MenuItem
              onClick={() => {
                actions.dashboard.unmakeTemplate([sandbox.id]);
              }}
            >
              Convert to sandbox
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                actions.dashboard.makeTemplate([sandbox.id]);
              }}
            >
              Make sandbox a template
            </MenuItem>
          )}
          <Menu.Divider />
          {sandbox.isTemplate ? (
            <MenuItem
              onClick={() =>
                actions.dashboard.deleteTemplate({
                  sandboxId: sandbox.id,
                  templateId: sandbox.template.id,
                })
              }
            >
              Delete template
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                actions.dashboard.deleteSandbox([sandbox.id]);
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

const FolderMenu = ({ folder, setRenaming }) => {
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
      <MenuItem onClick={() => setRenaming(true)}>Rename folder</MenuItem>
      <MenuItem
        onClick={() => actions.dashboard.deleteFolder({ path: folder.path })}
      >
        Delete folder
      </MenuItem>
    </>
  );
};

const MultiMenu = ({ selectedItems }) => {
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
        <MenuItem key={option.label} onClick={option.fn}>
          {option.label}
        </MenuItem>
      ))}
    </>
  );
};
