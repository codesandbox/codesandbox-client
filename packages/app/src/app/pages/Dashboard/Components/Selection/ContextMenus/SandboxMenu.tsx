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
import { useBetaSandboxEditor } from 'app/hooks/useBetaSandboxEditor';
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
  const { user, activeTeam } = useAppState();

  const { isPro } = useWorkspaceSubscription();
  const [hasBetaEditorExperiment] = useBetaSandboxEditor();

  const {
    browser: { copyToClipboard },
  } = useEffects();
  const { sandbox } = item;
  const isTemplate = !!sandbox.customTemplate;

  const { visible, setVisibility, position } = React.useContext(Context);
  const history = useHistory();
  const location = useLocation();
  const { userRole, isTeamAdmin } = useWorkspaceAuthorization();
  const { isFrozen } = useWorkspaceLimits();

  const url = sandboxUrl(sandbox, hasBetaEditorExperiment);
  const linksToV2 = sandbox.isV2 || (!sandbox.isSse && hasBetaEditorExperiment);
  const folderUrl = getFolderUrl(item, activeTeam);
  const boxType = sandbox.isV2 ? 'devbox' : 'sandbox';

  const label = isTemplate ? 'template' : boxType;
  const restrictedFork = isFrozen;

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

  if (location.pathname.includes('deleted')) {
    if (userRole === 'READ') return null;

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
    userRole === 'READ' || sandbox.permissions.preventSandboxExport;

  // TODO(@CompuIves): refactor this to an array

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 200 }}
    >
      {isTemplate && userRole !== 'READ' ? (
        <MenuItem
          onSelect={() => {
            actions.editor.forkExternalSandbox({
              sandboxId: sandbox.id,
              openInNewWindow: true,
              hasBetaEditorExperiment,
            });
          }}
        >
          Fork template
        </MenuItem>
      ) : null}
      <MenuItem
        onSelect={() => {
          if (linksToV2) {
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
        Open {label} in new tab
      </MenuItem>
      <MenuItem
        onSelect={() => {
          copyToClipboard(`https://codesandbox.io${url}`);
        }}
      >
        Copy {label} link
      </MenuItem>
      {isOwner && folderUrl !== location.pathname ? (
        <MenuItem
          onSelect={() => {
            history.push(folderUrl, { sandboxId: sandbox.id });
          }}
        >
          Show in folder
        </MenuItem>
      ) : null}

      <Menu.Divider />

      {!isTemplate && userRole !== 'READ' ? (
        <MenuItem
          onSelect={() => {
            actions.editor.forkExternalSandbox({
              sandboxId: sandbox.id,
              openInNewWindow: true,
              hasBetaEditorExperiment,
            });
          }}
          disabled={restrictedFork}
        >
          Fork {boxType}
        </MenuItem>
      ) : null}
      {isOwner && userRole !== 'READ' ? (
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

      {hasAccess && userRole !== 'READ' ? (
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
              Make {label} public
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
              Make {label} unlisted
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
              Make {label} private
            </MenuItem>
          )}
        </>
      ) : null}

      {hasAccess && userRole !== 'READ' && (
        <>
          <Menu.Divider />
          <MenuItem onSelect={() => setRenaming(true)}>Rename {label}</MenuItem>
        </>
      )}
      {hasAccess &&
        userRole !== 'READ' &&
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
            Remove {label} protection
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
            Protect {label}
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
      {hasAccess &&
        isPro &&
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
        hasAccess &&
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
      {hasAccess && userRole !== 'READ' && (
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
              Delete template
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
              Delete {boxType}
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
