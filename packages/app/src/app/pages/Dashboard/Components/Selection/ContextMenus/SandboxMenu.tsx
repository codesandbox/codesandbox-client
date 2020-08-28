import React from 'react';
import { useOvermind } from 'app/overmind';
import { Menu } from '@codesandbox/components';
import { useHistory, useLocation } from 'react-router-dom';

import {
  sandboxUrl,
  dashboard,
} from '@codesandbox/common/lib/utils/url-generator';
import { Context, MenuItem } from '../ContextMenu';
import { DashboardSandbox, DashboardTemplate, PageTypes } from '../../../types';

interface SandboxMenuProps {
  item: DashboardSandbox | DashboardTemplate;
  setRenaming: (value: boolean) => void;
  page: PageTypes;
}
export const SandboxMenu: React.FC<SandboxMenuProps> = ({
  item,
  setRenaming,
  page,
}) => {
  const {
    state: { user, activeTeam, activeWorkspaceAuthorization },
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

  // @ts-ignore
  const isPro = user.subscription_plan || user.subscription;

  const isOwner = React.useMemo(() => {
    if (item.type !== 'template') {
      return true;
    }
    return (
      item.sandbox.author && item.sandbox.author.username === user.username
    );
  }, [item, user]);

  if (location.pathname.includes('deleted')) {
    if (activeWorkspaceAuthorization === 'READ') return null;

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
      {isTemplate && activeWorkspaceAuthorization !== 'READ' ? (
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
      {!isTemplate && activeWorkspaceAuthorization !== 'READ' ? (
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
      {isOwner && activeWorkspaceAuthorization !== 'READ' ? (
        <MenuItem
          onSelect={() => {
            actions.modals.moveSandboxModal.open({
              sandboxIds: [item.sandbox.id],
            });
          }}
        >
          Move to Folder
        </MenuItem>
      ) : null}
      {activeWorkspaceAuthorization !== 'READ' && (
        <MenuItem
          onSelect={() => {
            actions.dashboard.downloadSandboxes([sandbox.id]);
          }}
        >
          Export {label}
        </MenuItem>
      )}
      {isOwner ? (
        <>
          {isPro ? (
            <>
              <Menu.Divider />
              {sandbox.privacy !== 0 && (
                <MenuItem
                  onSelect={() =>
                    actions.dashboard.changeSandboxPrivacy({
                      id: sandbox.id,
                      privacy: 0,
                      oldPrivacy: sandbox.privacy as 0 | 1 | 2,
                      page,
                      repoName: sandbox.originalGit?.repo,
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
                      page,
                      repoName: sandbox.originalGit?.repo,
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
                      page,
                      repoName: sandbox.originalGit?.repo,
                    })
                  }
                >
                  Make {label} private
                </MenuItem>
              )}
            </>
          ) : null}
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
                actions.dashboard.makeTemplates({
                  sandboxIds: [sandbox.id],
                  page,
                  repoName: sandbox.originalGit?.repo,
                });
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
                actions.dashboard.deleteSandbox({
                  ids: [sandbox.id],
                  page,
                  repoName: sandbox.originalGit?.repo,
                });
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
