import React from 'react';
import { useOvermind } from 'app/overmind';
import { Menu } from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { withRouter } from 'react-router-dom';

export const MenuOptionsComponent = ({
  sandbox,
  template,
  setEdit,
  history,
}) => {
  const { effects, actions } = useOvermind();
  const url = sandboxUrl({
    id: sandbox.id,
    alias: sandbox.alias,
  });

  const getFolderUrl = (path, isTemplate) => {
    if (isTemplate) return '/new-dashboard/templates';
    if (path === '/' || !path) return '/new-dashboard/all/drafts';

    return '/new-dashboard/all' + path;
  };

  return (
    <Menu>
      <Menu.IconButton name="more" size={9} title="Sandbox options" />
      <Menu.List>
        <Menu.Item
          onSelect={() => {
            history.push(getFolderUrl(sandbox.collection.path, template));
          }}
        >
          Show in Folder
        </Menu.Item>
        <Menu.Item
          onSelect={() => {
            window.open(`https://codesandbox.io${url}`);
          }}
        >
          Open sandbox
        </Menu.Item>
        <Menu.Item
          onSelect={() => {
            window.open(`https://codesandbox.io${url}`, '_blank');
          }}
        >
          Open sandbox in new tab
        </Menu.Item>
        <Menu.Item
          onSelect={() => {
            effects.browser.copyToClipboard(`https://codesandbox.io${url}`);
          }}
        >
          Copy sandbox link
        </Menu.Item>
        <Menu.Item
          onSelect={() => {
            actions.editor.forkExternalSandbox({
              sandboxId: sandbox.id,
              openInNewWindow: true,
            });
          }}
        >
          Fork sandbox
        </Menu.Item>
        <Menu.Item
          onSelect={() => {
            actions.dashboard.downloadSandboxes([sandbox.id]);
          }}
        >
          Export {template ? 'template' : 'sandbox'}
        </Menu.Item>
        <Menu.Item onSelect={() => setEdit(true)}>Rename sandbox</Menu.Item>
        {template ? (
          <Menu.Item
            onSelect={() => {
              actions.dashboard.unmakeTemplate([sandbox.id]);
            }}
          >
            Convert to Sandbox
          </Menu.Item>
        ) : (
          <Menu.Item
            onSelect={() => {
              actions.dashboard.makeTemplate([sandbox.id]);
            }}
          >
            Make sandbox a template
          </Menu.Item>
        )}
        {template ? (
          <Menu.Item onSelect={() => {}}>Delete template</Menu.Item>
        ) : (
          <Menu.Item
            onSelect={() => {
              actions.dashboard.deleteSandbox([sandbox.id]);
            }}
          >
            Delete sandbox
          </Menu.Item>
        )}
      </Menu.List>
    </Menu>
  );
};

// @ts-ignore
export const MenuOptions = withRouter(MenuOptionsComponent);
