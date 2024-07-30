import React from 'react';
import { useAppState, useEffects, useActions } from 'app/overmind';
import { useHistory, useLocation } from 'react-router-dom';
import { Menu, Tooltip } from '@codesandbox/components';

import {
  sandboxUrl,
  dashboard,
} from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
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
  const { activeTeam } = useAppState();

  const { isPro } = useWorkspaceSubscription();

  const {
    browser: { copyToClipboard },
  } = useEffects();
  const { sandbox } = item;
  const isTemplate = !!sandbox.customTemplate;

  const { visible, setVisibility, position } = React.useContext(Context);
  const history = useHistory();
  const location = useLocation();
  const { userRole, isTeamAdmin, isTeamViewer } = useWorkspaceAuthorization();
  const { isFrozen } = useWorkspaceLimits();

  const url = sandboxUrl(sandbox);
  const folderUrl = getFolderUrl(item, activeTeam);
  const boxType = sandbox.isV2 ? 'devbox' : 'sandbox';

  const restrictedFork = isFrozen;

  const hasAccess = React.useMemo(() => {
    if (item.sandbox.teamId === activeTeam) {
      return true;
    }

    return false;
  }, [item, activeTeam]);

  const hasWriteAccess = hasAccess && !isTeamViewer;

  if (location.pathname.includes('deleted') && hasWriteAccess) {
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
          Recover sandbox
        </MenuItem>
        <MenuItem
          onSelect={() => {
            actions.dashboard.permanentlyDeleteSandboxes([sandbox.id]);
            setVisibility(false);
          }}
        >
          Delete permanently
        </MenuItem>
      </Menu.ContextMenu>
    );
  }

  const preventSandboxExport =
    !hasWriteAccess || sandbox.permissions.preventSandboxExport;

  // TODO(@CompuIves): refactor this to an array

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 200 }}
    >
      {isTemplate && hasWriteAccess ? (
        <MenuItem
          onSelect={() => {
            actions.dashboard.forkSandbox({
              sandboxId: sandbox.id,
              openInNewWindow: true,
              redirectAfterFork: true,
            });
          }}
        >
          Fork template
        </MenuItem>
      ) : null}
      <MenuItem
        onSelect={() => {
          window.location.href = url;
        }}
      >
        Open
      </MenuItem>
      <MenuItem
        onSelect={() => {
          window.open(url, '_blank');
        }}
      >
        Open in new tab
      </MenuItem>
      <MenuItem
        onSelect={() => {
          copyToClipboard(`${window.location.origin}${url}`);
        }}
      >
        Copy link
      </MenuItem>
      {hasAccess && location.pathname === '/dashboard/recent' ? (
        <MenuItem
          onSelect={() => {
            history.push(folderUrl, { sandboxId: sandbox.id });
          }}
        >
          Show in folder
        </MenuItem>
      ) : null}

      <Menu.Divider />

      {hasWriteAccess && !isTemplate ? (
        <MenuItem
          onSelect={() => {
            actions.dashboard.forkSandbox({
              sandboxId: sandbox.id,
              openInNewWindow: true,
              redirectAfterFork: true,
              body: {
                privacy: sandbox.privacy as 2 | 1 | 0,
                collectionId: sandbox.draft ? undefined : sandbox.collection.id,
              },
            });
          }}
          disabled={restrictedFork}
        >
          Fork
        </MenuItem>
      ) : null}

      {hasWriteAccess && !isTemplate ? (
        <MenuItem
          onSelect={() => {
            actions.modals.moveSandboxModal.open({
              sandboxIds: [item.sandbox.id],
              preventSandboxLeaving:
                item.sandbox.permissions.preventSandboxLeaving,
            });
          }}
        >
          Move to folder
        </MenuItem>
      ) : null}

      {!sandbox.isV2 && (
        <Tooltip
          label={
            preventSandboxExport
              ? 'You do not have permission to export this Sandbox'
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
              Download zip
            </MenuItem>
          </div>
        </Tooltip>
      )}

      {hasWriteAccess ? (
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
              Make public
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
            >
              Make unlisted
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
            >
              Make private
            </MenuItem>
          )}
        </>
      ) : null}

      {hasWriteAccess && (
        <>
          <Menu.Divider />
          <MenuItem onSelect={() => setRenaming(true)}>Rename</MenuItem>
        </>
      )}
      {hasWriteAccess &&
        !isTemplate &&
        (sandbox.isFrozen ? (
          <MenuItem
            onSelect={() => {
              actions.dashboard.changeSandboxesFrozen({
                sandboxIds: [sandbox.id],
                isFrozen: false,
              });
            }}
          >
            Remove protection
          </MenuItem>
        ) : (
          <MenuItem
            onSelect={() => {
              actions.dashboard.changeSandboxesFrozen({
                sandboxIds: [sandbox.id],
                isFrozen: true,
              });
            }}
          >
            Protect
          </MenuItem>
        ))}

      {boxType === 'sandbox' && userRole !== 'READ' && (
        <MenuItem
          onSelect={() => {
            actions.dashboard.convertToDevbox(sandbox.id);
          }}
        >
          Convert to Devbox
        </MenuItem>
      )}

      {hasAccess &&
        (isTemplate ? (
          <MenuItem
            onSelect={() => {
              actions.dashboard.unmakeTemplates({
                templateIds: [sandbox.id],
                isOnRecentPage: location.pathname.includes('recent'),
              });
            }}
          >
            Convert back to {boxType}
          </MenuItem>
        ) : (
          <MenuItem
            onSelect={() => {
              actions.dashboard.makeTemplates({
                sandboxIds: [sandbox.id],
                isOnRecentPage: location.pathname.includes('recent'),
              });
            }}
          >
            Convert into a template
          </MenuItem>
        ))}
      {isPro &&
        isTeamAdmin &&
        (sandbox.permissions.preventSandboxLeaving ? (
          <MenuItem
            onSelect={() => {
              actions.dashboard.setPreventSandboxesLeavingWorkspace({
                sandboxIds: [sandbox.id],
                preventSandboxLeaving: false,
              });
            }}
          >
            Allow leaving workspace
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
            Prevent leaving workspace
          </MenuItem>
        ))}
      {!sandbox.isV2 &&
        isPro &&
        isTeamAdmin &&
        (sandbox.permissions.preventSandboxExport ? (
          <MenuItem
            onSelect={() => {
              actions.dashboard.setPreventSandboxesExport({
                sandboxIds: [sandbox.id],
                preventSandboxExport: false,
              });
            }}
          >
            Allow export as .zip
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
            Prevent export as .zip
          </MenuItem>
        ))}
      {hasWriteAccess && (
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
              Delete
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
              Delete
            </MenuItem>
          )}
        </>
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
