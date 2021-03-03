import {
  getChildren as calculateChildren,
  inDirectory,
} from '@codesandbox/common/lib/sandbox/modules';
import { Directory, Module } from '@codesandbox/common/lib/types';
import { useAppState, useActions, useReaction } from 'app/overmind';
import React from 'react';
import { DropTarget, DropTargetMonitor } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import * as CSSProps from 'styled-components/cssprop'; // eslint-disable-line

import { DirectoryChildren } from './DirectoryChildren';
import { DirectoryEntryModal } from './DirectoryEntryModal';
import { EntryContainer, Opener, Overlay } from './elements';
import { Entry } from './Entry';
import { validateTitle } from './validateTitle';

const readDataURL = (file: File): Promise<string | ArrayBuffer> =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });

type parsedFiles = { [k: string]: { dataURI: string; type: string } };
const getFiles = async (files: File[] | FileList): Promise<parsedFiles> => {
  const returnedFiles = {};
  await Promise.all(
    Array.from(files)
      .filter(Boolean)
      .map(async file => {
        const dataURI = await readDataURL(file);
        // @ts-ignore
        returnedFiles[file.path || file.name] = {
          dataURI,
          type: file.type,
        };
      })
  );

  return returnedFiles;
};

type ItemTypes = 'module' | 'directory';

type Modal = {
  title: string;
  body: React.ReactNode;
  onConfirm: () => void;
  primaryMessage?: string;
};

interface Props {
  id: string;
  root?: boolean;
  readonly?: boolean;
  initializeProperties?: Function;
  shortid?: string;
  store?: any;
  connectDropTarget?: Function;
  isOver?: boolean;
  canDrop?: boolean;
  signals?: any;
  title: string;
  sandboxId?: string;
  sandboxTemplate?: any;
  mainModuleId?: string;
  modules?: any[];
  directories?: any[];
  currentModuleShortid?: string;
  isInProjectView?: boolean;
  markTabsNotDirty?: () => void;
  depth?: number;
  getModulePath?: (
    modules: Module[],
    directories: Directory[],
    id: string
  ) => string;
}

const DirectoryEntryComponent: React.FunctionComponent<Props> = ({
  id,
  readonly,
  root,
  initializeProperties,
  shortid,
  connectDropTarget,
  isOver,
  depth = 0,
  getModulePath,
  canDrop,
  title: directoryTitle,
}) => {
  const {
    isLoggedIn,
    editor: {
      currentSandbox: { modules, directories, privacy },
      shouldDirectoryBeOpen,
    },
  } = useAppState();
  const {
    files: {
      moduleCreated,
      moduleRenamed,
      directoryCreated,
      directoryRenamed,
      directoryDeleted,
      moduleDeleted,
      filesUploaded,
    },
    editor: { moduleSelected, moduleDoubleClicked, discardModuleChanges },
  } = useActions();
  const reaction = useReaction();

  const [creating, setCreating] = React.useState<ItemTypes>(null);
  const [open, setOpen] = React.useState(
    root || shouldDirectoryBeOpen({ directoryId: id })
  );
  const [modalConfirm, setModalConfirm] = React.useState<Modal | null>(null);

  React.useEffect(() => {
    if (initializeProperties) {
      initializeProperties({
        onCreateModuleClick,
        onCreateDirectoryClick,
        onUploadFileClick,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(
    () =>
      reaction(
        ({ editor }) => editor.currentModule,
        currentModule => {
          setOpen(
            isOpen =>
              isOpen ||
              shouldDirectoryBeOpen({ directoryId: id, module: currentModule })
          );
        }
      ),

    // shouldDirectoryOpen causes this to unmount for some reason, which bugs out how directories open and close
    // eslint-disable-next-line
    [id, reaction]
  );

  React.useEffect(() => {
    if (isOver) {
      setOpen(true);
    }
  }, [isOver]);

  const resetState = React.useCallback(() => setCreating(null), []);

  const onCreateModuleClick = React.useCallback(() => {
    setCreating('module');
    setOpen(true);

    return true;
  }, []);

  const createModule = React.useCallback(
    (_, title: string) => {
      moduleCreated({
        title,
        directoryShortid: shortid,
      });

      resetState();
    },
    [moduleCreated, resetState, shortid]
  );

  const renameModule = React.useCallback(
    (moduleShortid: string, title: string) => {
      moduleRenamed({ moduleShortid, title });
    },
    [moduleRenamed]
  );

  const closeModals = React.useCallback(() => {
    setModalConfirm(null);
  }, []);

  const confirmDeleteModule = React.useCallback(
    (moduleShortid: string, moduleName: string) => {
      setModalConfirm({
        title: 'Delete File',
        body: (
          <span>
            Are you sure you want to delete{' '}
            <b
              css={`
                word-break: break-all;
              `}
            >
              {moduleName}
            </b>
            ?
            <br />
            The file will be permanently removed.
          </span>
        ),
        onConfirm: () => {
          closeModals();
          moduleDeleted({
            moduleShortid,
          });
        },
      });
    },
    [closeModals, moduleDeleted]
  );

  const onCreateDirectoryClick = React.useCallback(() => {
    setCreating('directory');
    setOpen(true);

    return true;
  }, []);

  const createDirectory = React.useCallback(
    (_, title: string) => {
      directoryCreated({
        title,
        directoryShortid: shortid,
      });
      resetState();
    },
    [directoryCreated, resetState, shortid]
  );

  const onUploadFileClick = React.useCallback(() => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'true');
    fileSelector.onchange = async event => {
      const target = event.target as HTMLInputElement;
      const files = await getFiles(target.files);

      filesUploaded({
        files,
        directoryShortid: shortid,
      });
    };

    fileSelector.click();
  }, [filesUploaded, shortid]);

  const renameDirectory = React.useCallback(
    (directoryShortid: string, title: string) => {
      directoryRenamed({ title, directoryShortid });
    },
    [directoryRenamed]
  );

  const confirmDeleteDirectory = React.useCallback(
    (directoryShortid: string, directoryName: string) => {
      setModalConfirm({
        title: 'Delete Directory',
        body: (
          <span>
            Are you sure you want to delete <b>{directoryName}</b>?
            <br />
            The directory will be permanently removed.
          </span>
        ),
        onConfirm: () => {
          closeModals();
          directoryDeleted({
            directoryShortid,
          });
        },
      });
    },
    [closeModals, directoryDeleted]
  );

  const confirmDiscardChanges = React.useCallback(
    (moduleShortid: string, moduleName: string) => {
      setModalConfirm({
        title: 'Discard Changes',
        primaryMessage: 'Discard',
        body: (
          <span>
            Are you sure you want to discard changes on <b>{moduleName}</b>?
          </span>
        ),
        onConfirm: () => {
          closeModals();
          discardModuleChanges({
            moduleShortid,
          });
        },
      });
    },
    [closeModals, discardModuleChanges]
  );

  const toggleOpen = React.useCallback(() => setOpen(!open), [open]);

  const closeTree = React.useCallback(() => setOpen(false), []);

  const getChildren = React.useCallback(
    () => calculateChildren(modules, directories, shortid),
    [directories, modules, shortid]
  );

  const validateModuleTitle = React.useCallback(
    (moduleId: string, title: string) =>
      validateTitle(moduleId, title, getChildren()),
    [getChildren]
  );

  const validateDirectoryTitle = React.useCallback(
    (directoryId: string, title: string) => {
      if (root) return null;

      return validateTitle(directoryId, title, getChildren());
    },
    [getChildren, root]
  );

  const setCurrentModule = React.useCallback(
    (moduleId: string) => {
      moduleSelected({ id: moduleId });
    },
    [moduleSelected]
  );

  const markTabsNotDirty = React.useCallback(() => {
    moduleDoubleClicked();
  }, [moduleDoubleClicked]);

  return connectDropTarget(
    <div style={{ position: 'relative' }}>
      <Overlay isOver={isOver && canDrop} />
      {!root && (
        <EntryContainer>
          <Entry
            id={id}
            shortid={shortid}
            readonly={readonly}
            title={directoryTitle}
            depth={depth}
            type={open ? 'directory-open' : 'directory'}
            root={root}
            isOpen={open}
            onClick={toggleOpen}
            renameValidator={validateDirectoryTitle}
            discardModuleChanges={confirmDiscardChanges}
            rename={!readonly && !root && renameDirectory}
            onCreateModuleClick={onCreateModuleClick}
            onCreateDirectoryClick={onCreateDirectoryClick}
            onUploadFileClick={isLoggedIn && privacy === 0 && onUploadFileClick}
            deleteEntry={!root && confirmDeleteDirectory}
            hasChildren={getChildren().length > 0}
            closeTree={closeTree}
            getModulePath={getModulePath}
          />
        </EntryContainer>
      )}
      <DirectoryEntryModal
        isOpen={Boolean(modalConfirm)}
        onClose={closeModals}
        {...modalConfirm}
      />
      {open && (
        <Opener aria-hidden={!open} open={open}>
          {creating === 'directory' && (
            <Entry
              id=""
              title=""
              state="editing"
              type="directory"
              depth={depth + 1}
              renameValidator={validateModuleTitle}
              rename={createDirectory}
              onRenameCancel={resetState}
            />
          )}
          <DirectoryChildren
            depth={depth}
            readonly={readonly}
            renameModule={renameModule}
            parentShortid={shortid}
            renameValidator={validateModuleTitle}
            deleteEntry={confirmDeleteModule}
            setCurrentModule={setCurrentModule}
            markTabsNotDirty={markTabsNotDirty}
            discardModuleChanges={confirmDiscardChanges}
            getModulePath={getModulePath}
          />
          {creating === 'module' && (
            <Entry
              id=""
              title=""
              state="editing"
              depth={depth + 1}
              renameValidator={validateModuleTitle}
              rename={createModule}
              onRenameCancel={resetState}
            />
          )}
        </Opener>
      )}
    </div>
  );
};

const FILES_TO_IGNORE = [
  '.DS_Store', // macOs
  'Thumbs.db', // Windows
];

const entryTarget = {
  drop: (props, monitor) => {
    if (monitor == null) return;

    // Check if only child is selected:
    if (!monitor.isOver({ shallow: true })) return;

    const sourceItem = monitor.getItem();

    if (sourceItem.dirContent) {
      sourceItem.dirContent.then(async (droppedFiles: File[]) => {
        const files = await getFiles(
          droppedFiles.filter(file => !FILES_TO_IGNORE.includes(file.name))
        );

        props.signals.files.filesUploaded({
          files,
          directoryShortid: props.shortid,
        });
      });
    } else if (sourceItem.directory) {
      props.signals.files.directoryMovedToDirectory({
        shortid: sourceItem.shortid,
        directoryShortid: props.shortid,
      });
    } else {
      props.signals.files.moduleMovedToDirectory({
        moduleShortid: sourceItem.shortid,
        directoryShortid: props.shortid,
      });
    }
  },

  canDrop: (props, monitor) => {
    if (props.readonly) return false;
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    if (source.id === props.id) return false;
    if (props.root) return true;

    return !inDirectory(props.directories, source.shortid, props.shortid);
  },
};

function collectTarget(connectMonitor, monitor: DropTargetMonitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connectMonitor.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
}

// eslint-disable-next-line import/no-default-export
export const DirectoryEntry = DropTarget(
  ['ENTRY', NativeTypes.FILE],
  entryTarget,
  collectTarget
)(React.memo(DirectoryEntryComponent));
