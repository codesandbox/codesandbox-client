import React from 'react';
import { useAppState, useEffects, useActions } from 'app/overmind';
import { useHistory, useLocation } from 'react-router-dom';
import { Menu, Tooltip } from '@codesandbox/components';

import {
  sandboxUrl,
  dashboard,
} from '@codesandbox/common/lib/utils/url-generator';
import { useSubscription } from 'app/hooks/useSubscription';
import { Context, MenuItem } from '../ContextMenu';
import { DashboardSandbox, DashboardTemplate } from '../../../types';

interface SandboxMenuProps {
  item: DashboardSandbox | DashboardTemplate;
  setRenaming: (value: boolean) => void;
}
export const SandboxMenu: React.FC<SandboxMenuProps> = ({
  item,
  setRenaming,
}) => {
  const actions = useActions();
  const { user, activeTeam, activeWorkspaceAuthorization } = useAppState();
  const { hasActiveSubscription, hasMaxPublicSandboxes } = useSubscription();
  const {
    browser: { copyToClipboard },
  } = useEffects();
  const { sandbox, type } = item;
  const isTemplate = type === 'template';

  const { visible, setVisibility, position } = React.useContext(Context);

  const history = useHistory();
  const location = useLocation();

  const url = sandboxUrl(sandbox);

  const folderUrl = getFolderUrl(item, activeTeam);

  const label = isTemplate ? 'Template' : 'Sandbox';
  const isViewOnly = !hasActiveSubscription && sandbox.privacy !== 0;

  // TODO(@CompuIves): remove the `item.sandbox.teamId === null` check, once the server is not
  // responding with teamId == null for personal templates anymore.
  const hasAccess = React.useMemo(() => {
    if (item.sandbox.teamId === activeTeam) {
      return true;
    }

    if (item.sandbox.teamId === null) {
      if (!item.sandbox.authorId) {
        return false;
      }

      return true;
    }

    return false;
  }, [item, activeTeam]);

  const isOwner = React.useMemo(() => {
    if (item.type !== 'template') {
      return item.sandbox.teamId === activeTeam || item.sandbox.teamId === null;
    }

    return (
      item.sandbox.author && item.sandbox.author.username === user.username
    );
  }, [item, user, activeTeam]);

  if (location.pathname.includes('archive')) {
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

  const preventSandboxExport =
    activeWorkspaceAuthorization === 'READ' ||
    sandbox.permissions.preventSandboxExport;

  // TODO(@CompuIves): refactor this to an array

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
      <MenuItem
        onSelect={() => {
          if (sandbox.isV2) {
            window.location.href = url;
          } else {
            history.push(url);
          }
        }}
      >
        Open {label}
      </MenuItem>
      <MenuItem
        onSelect={() => {
          window.open(`https://codesandbox.io${url}`, '_blank');
        }}
      >
        Open {label} in New Tab
      </MenuItem>
      <MenuItem
        onSelect={() => {
          copyToClipboard(`https://codesandbox.io${url}`);
        }}
      >
        Copy {label} Link
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

      {!isTemplate && activeWorkspaceAuthorization !== 'READ' ? (
        <MenuItem
          onSelect={() => {
            actions.editor.forkExternalSandbox({
              sandboxId: sandbox.id,
              openInNewWindow: true,
            });
          }}
          disabled={isViewOnly}
        >
          Fork Sandbox
        </MenuItem>
      ) : null}
      {isOwner && activeWorkspaceAuthorization !== 'READ' ? (
        <MenuItem
          onSelect={() => {
            actions.modals.moveSandboxModal.open({
              sandboxIds: [item.sandbox.id],
              preventSandboxLeaving:
                item.sandbox.permissions.preventSandboxLeaving ||
                (!hasActiveSubscription && hasMaxPublicSandboxes),
            });
          }}
        >
          Move to Folder
        </MenuItem>
      ) : null}

      {!sandbox.isV2 && (
        <Tooltip
          label={
            preventSandboxExport
              ? 'You do not have permission to export this sandbox'
              : null
          }
        >
          <div>
            <MenuItem
              data-disabled={preventSandboxExport ? true : null}
              onSelect={() => {
                if (preventSandboxExport) return;
                actions.dashboard.downloadSandboxes([sandbox.id]);
              }}
            >
              Export {label}
            </MenuItem>
          </div>
        </Tooltip>
      )}

      {hasAccess &&
      activeWorkspaceAuthorization !== 'READ' &&
      hasActiveSubscription ? (
        <>
          <Menu.Divider />
          {sandbox.privacy !== 0 && (
            <MenuItem
              onSelect={() =>
                actions.dashboard.changeSandboxesPrivacy({
                  sandboxIds: [sandbox.id],
                  privacy: 0,
                })
              }
            >
              Make {label} Public
            </MenuItem>
          )}
          {sandbox.privacy !== 1 && (
            <MenuItem
              onSelect={() =>
                actions.dashboard.changeSandboxesPrivacy({
                  sandboxIds: [sandbox.id],
                  privacy: 1,
                })
              }
              disabled={isViewOnly}
            >
              Make {label} Unlisted
            </MenuItem>
          )}
          {sandbox.privacy !== 2 && (
            <MenuItem
              onSelect={() =>
                actions.dashboard.changeSandboxesPrivacy({
                  sandboxIds: [sandbox.id],
                  privacy: 2,
                })
              }
              disabled={isViewOnly}
            >
              Make {label} Private
            </MenuItem>
          )}
        </>
      ) : null}
      {hasAccess && activeWorkspaceAuthorization !== 'READ' && (
        <>
          <Menu.Divider />
          <MenuItem onSelect={() => setRenaming(true)} disabled={isViewOnly}>
            Rename {label}
          </MenuItem>
        </>
      )}
      {hasAccess &&
        activeWorkspaceAuthorization !== 'READ' &&
        !isTemplate &&
        (sandbox.isFrozen ? (
          <MenuItem
            onSelect={() => {
              actions.dashboard.changeSandboxesFrozen({
                sandboxIds: [sandbox.id],
                isFrozen: false,
              });
            }}
            disabled={isViewOnly}
          >
            Unfreeze {label}
          </MenuItem>
        ) : (
          <MenuItem
            onSelect={() => {
              actions.dashboard.changeSandboxesFrozen({
                sandboxIds: [sandbox.id],
                isFrozen: true,
              });
            }}
            disabled={isViewOnly}
          >
            Freeze {label}
          </MenuItem>
        ))}

      {hasAccess &&
        (isTemplate ? (
          <MenuItem
            onSelect={() => {
              actions.dashboard.unmakeTemplates({
                templateIds: [sandbox.id],
              });
            }}
            disabled={isViewOnly}
          >
            Convert to Sandbox
          </MenuItem>
        ) : (
          <MenuItem
            onSelect={() => {
              actions.dashboard.makeTemplates({
                sandboxIds: [sandbox.id],
              });
            }}
            disabled={isViewOnly}
          >
            Make Sandbox a Template
          </MenuItem>
        ))}
      {hasAccess &&
        hasActiveSubscription &&
        activeWorkspaceAuthorization === 'ADMIN' &&
        (sandbox.permissions.preventSandboxLeaving ? (
          <MenuItem
            onSelect={() => {
              actions.dashboard.setPreventSandboxesLeavingWorkspace({
                sandboxIds: [sandbox.id],
                preventSandboxLeaving: false,
              });
            }}
          >
            Allow Leaving Workspace
          </MenuItem>
        ) : (
          <MenuItem
            onSelect={() => {
              actions.dashboard.setPreventSandboxesLeavingWorkspace({
                sandboxIds: [sandbox.id],
                preventSandboxLeaving: true,
              });
            }}
          >
            Prevent Leaving Workspace
          </MenuItem>
        ))}
      {!sandbox.isV2 &&
        hasAccess &&
        hasActiveSubscription &&
        activeWorkspaceAuthorization === 'ADMIN' &&
        (sandbox.permissions.preventSandboxExport ? (
          <MenuItem
            onSelect={() => {
              actions.dashboard.setPreventSandboxesExport({
                sandboxIds: [sandbox.id],
                preventSandboxExport: false,
              });
            }}
          >
            Allow Export as .zip
          </MenuItem>
        ) : (
          <MenuItem
            onSelect={() => {
              actions.dashboard.setPreventSandboxesExport({
                sandboxIds: [sandbox.id],
                preventSandboxExport: true,
              });
            }}
          >
            Prevent Export as .zip
          </MenuItem>
        ))}
      {hasAccess && activeWorkspaceAuthorization !== 'READ' && (
        <>
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
              Archive Template
            </MenuItem>
          ) : (
            <MenuItem
              onSelect={() => {
                actions.dashboard.deleteSandbox({
                  ids: [sandbox.id],
                });
                setVisibility(false);
              }}
            >
              Archive Sandbox
            </MenuItem>
          )}
        </>
      )}
      {!hasAccess && !isTemplate && location.pathname.includes('liked') && (
        <MenuItem
          onSelect={() => {
            actions.dashboard.unlikeSandbox(sandbox.id);
          }}
        >
          Unlike Sandbox
        </MenuItem>
      )}
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

  return dashboard.sandboxes(path || '/', activeTeamId);
};
