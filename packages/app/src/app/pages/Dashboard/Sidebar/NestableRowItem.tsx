import React from 'react';
import { useActions, useAppState } from 'app/overmind';
import { orderBy } from 'lodash-es';
import { join, dirname } from 'path';
import { useHistory, useLocation } from 'react-router-dom';
import { ENTER, ESC } from '@codesandbox/common/lib/utils/keycodes';
import track, {
  trackImprovedDashboardEvent,
} from '@codesandbox/common/lib/utils/analytics';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';

import {
  IconButton,
  Element,
  Stack,
  Input,
  Link,
  Icon,
  Text,
} from '@codesandbox/components';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardBaseFolder, PageTypes } from '../types';
import {
  SidebarContext,
  MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE,
  linkStyles,
} from './utils';
import { NEW_FOLDER_ID } from './constants';
import { RowItem } from './RowItem';
import { getParentPath } from '../utils/path';

interface NestableRowItemProps {
  name: string;
  folderPath: string;
  path: string;
  page: PageTypes;
  folders: DashboardBaseFolder[];
}

export const NestableRowItem: React.FC<NestableRowItemProps> = ({
  name,
  path,
  page,
  folderPath,
  folders,
}) => {
  const actions = useActions();
  const state = useAppState();

  const {
    menuState: {
      menuFolder,
      setMenuFolder,
      setMenuVisibility,
      setMenuPosition,
      isRenamingFolder,
      setRenamingFolder,
      newFolderPath,
      setNewFolderPath,
    },
  } = React.useContext(SidebarContext);

  const [foldersVisible, setFoldersVisibility] = React.useState(false);

  let hasNewNestedFolder = false;
  if (newFolderPath !== null) {
    const newFolderParent = newFolderPath.replace(`/${NEW_FOLDER_ID}`, '');
    if (folderPath === '/') {
      hasNewNestedFolder = true;
    } else if (newFolderParent.length && folderPath.includes(newFolderParent)) {
      hasNewNestedFolder = true;
    }
  }

  const location = useLocation();
  const currentFolderLocationPath = dashboardUrls.sandboxes(folderPath);
  React.useEffect(() => {
    // Auto open folder in the sidebar if it's opened
    const pathName = location.pathname;
    const prefixCheck =
      folderPath === '/'
        ? currentFolderLocationPath
        : currentFolderLocationPath + '/';

    if (pathName.startsWith(prefixCheck) && !foldersVisible) {
      setFoldersVisibility(true);
    }

    // We don't want to recalculate after mount
    // eslint-disable-next-line
  }, [location.pathname, currentFolderLocationPath, setFoldersVisibility]);

  React.useEffect(() => {
    if (hasNewNestedFolder) setFoldersVisibility(true);
  }, [hasNewNestedFolder]);

  const onContextMenu = event => {
    event.preventDefault();
    setMenuVisibility(true);
    setMenuFolder({ name, path: folderPath });
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  let subFolders: DashboardBaseFolder[];
  if (folderPath === '/') {
    subFolders = folders.filter(folder => {
      if (folder.path === newFolderPath) {
        return newFolderPath.replace(`/${NEW_FOLDER_ID}`, '') === '';
      }
      return !folder.parent;
    });
  } else {
    subFolders = folders.filter(folder => {
      const parentPath = getParentPath(folder.path);

      return parentPath === folderPath;
    });
  }

  const nestingLevel =
    folderPath === '/' ? 0 : folderPath.split('/').length - 1;
  const history = useHistory();

  /* Rename logic */
  const isRenaming = isRenamingFolder && menuFolder.path === folderPath;
  const isNewFolder = newFolderPath === folderPath;
  const [newName, setNewName] = React.useState(name);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value && value.trim()) {
      event.target.setCustomValidity('');
    } else {
      event.target.setCustomValidity('Folder name is required.');
    }
    setNewName(value);
  };
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESC) {
      // Reset value and exit without saving
      setNewName(name);
      setRenamingFolder(false);
      setNewFolderPath(null);
    }
  };
  const onInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    // prevent redirection when Input is clicked.
    event.stopPropagation();
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    if (name === newName) {
      // nothing to do here
    } else if (isNewFolder) {
      if (newName) {
        const sanitizedPath = folderPath.replace(NEW_FOLDER_ID, newName);
        await actions.dashboard.createFolder(sanitizedPath);
        track('Dashboard - Create Directory', {
          source: 'Sidebar',
          dashboardVersion: 2,
          folderPath: sanitizedPath,
        });
      }
    } else {
      const newPath = join(dirname(folderPath), newName);
      await actions.dashboard.renameFolder({
        path: folderPath,
        newPath,
        teamId: state.activeTeam,
        newTeamId: state.activeTeam,
      });

      track('Dashboard - Rename Folder', {
        source: 'Sidebar',
        dashboardVersion: 2,
      });

      if (currentFolderLocationPath === location.pathname) {
        // if this directory is opened
        history.push(dashboardUrls.sandboxes(newPath, state.activeTeam));
      }
    }

    setNewFolderPath(null);
    return setRenamingFolder(false);
  };

  const onInputBlur = () => {
    // save value when you click outside or tab away
    setRenamingFolder(false);
    setNewFolderPath(null);
    onSubmit();
  };

  const folderUrl = dashboardUrls.sandboxes(folderPath, state.activeTeam);

  return (
    <>
      <RowItem
        name={name}
        path={path}
        folderPath={folderPath}
        page="sandboxes"
        icon="folder"
        nestingLevel={nestingLevel}
        setFoldersVisibility={setFoldersVisibility}
      >
        <Link
          to={folderUrl}
          title={name}
          onClick={() => {
            const event = MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE[page];
            if (event) {
              trackImprovedDashboardEvent(
                MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE[page]
              );
            }
            history.push(folderUrl);
            return false;
          }}
          onContextMenu={onContextMenu}
          onKeyDown={event => {
            if (event.keyCode === ENTER && !isRenaming && !isNewFolder) {
              history.push(folderUrl, {
                focus: 'FIRST_ITEM',
              });
            }
          }}
          tabIndex={0}
          style={{
            ...linkStyles,
            paddingLeft: nestingLevel * 16,
          }}
          css={{
            '&:focus-visible': {
              outlineOffset: '-1px',
              outline: '1px solid #ac9cff',
            },
          }}
        >
          {subFolders.length ? (
            <IconButton
              name="caret"
              size={8}
              title="Toggle folders"
              onClick={event => {
                setFoldersVisibility(!foldersVisible);
                event.stopPropagation();
              }}
              css={{
                width: '24px',
                height: nestingLevel === 0 ? '36px' : '32px',
                borderRadius: 0,
                svg: {
                  transform: foldersVisible ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 100ms ease-in-out',
                },
              }}
            />
          ) : (
            <Element as="span" css={{ width: '24px', flexShrink: 0 }} />
          )}

          <Stack align="center" gap={1} css={{ maxWidth: '96%' }}>
            <Stack
              justify="center"
              align="center"
              css={{
                padding: '0 4px',
                marginRight: '8px',
              }}
            >
              <Icon name="folder" size={16} />
            </Stack>

            {isRenaming || isNewFolder ? (
              <form onSubmit={onSubmit}>
                <Input
                  autoFocus
                  required
                  onClick={onInputClick}
                  value={newName}
                  onChange={onChange}
                  onKeyDown={onInputKeyDown}
                  onBlur={onInputBlur}
                />
              </form>
            ) : (
              <Text maxWidth="100%" css={{ userSelect: 'none' }}>
                {name}
              </Text>
            )}
          </Stack>
        </Link>
      </RowItem>

      <AnimatePresence>
        {foldersVisible && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.15 } }}
            style={{ paddingLeft: 0 }}
          >
            {orderBy(subFolders, 'name')
              .sort(a => 1)
              .map(folder => (
                <NestableRowItem
                  page={page}
                  key={folder.path}
                  name={folder.name}
                  path={dashboardUrls.sandboxes(folder.path, state.activeTeam)}
                  folderPath={folder.path}
                  folders={folders}
                />
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
};
