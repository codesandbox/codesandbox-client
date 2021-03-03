import * as CSSProps from 'styled-components/cssprop'; // eslint-disable-line
import {
  getChildren as calculateChildren,
  inDirectory,
} from '@codesandbox/common/lib/sandbox/modules';
import { Directory, Module } from '@codesandbox/common/lib/types';
import { useAppState, useActions, useReaction } from 'app/overmind';
import React from 'react';
import { DropTarget, DropTargetMonitor } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

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
  initializeProperties?: Function;
  shortid?: string;
  store?: any;
  connectDropTarget?: Function;
  isOver?: boolean;
  canDrop?: boolean;
  signals?: any;
  title?: string;
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

const DirectoryEntryElement: React.FunctionComponent<Props> = ({
  id,
  root,
  initializeProperties,
  shortid,
  connectDropTarget,
  isOver,
  depth = 0,
  getModulePath,
  canDrop,
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

  const resetState = () => setCreating(null);

  const onCreateModuleClick = () => {
    setCreating('module');
    setOpen(true);

    return true;
  };

  const createModule = (_, title: string) => {
    moduleCreated({
      title,
      directoryShortid: shortid,
    });

    resetState();
  };

  const renameModule = (moduleShortid: string, title: string) => {
    moduleRenamed({ moduleShortid, title });
  };

  const confirmDeleteModule = (moduleShortid: string, moduleName: string) => {
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
  };

  const onCreateDirectoryClick = () => {
    setCreating('directory');
    setOpen(true);

    return true;
  };

  const createDirectory = (_, title: string) => {
    directoryCreated({
      title,
      directoryShortid: shortid,
    });
    resetState();
  };

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

  const renameDirectory = (directoryShortid: string, title: string) => {
    directoryRenamed({ title, directoryShortid });
  };

  const closeModals = () => {
    setModalConfirm(null);
  };

  const confirmDeleteDirectory = (
    directoryShortid: string,
    directoryName: string
  ) => {
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
  };

  const confirmDiscardChanges = (moduleShortid: string, moduleName: string) => {
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
  };

  const toggleOpen = () => setOpen(!open);

  const closeTree = () => setOpen(false);

  const validateModuleTitle = (moduleId: string, title: string) =>
    validateTitle(moduleId, title, getChildren());

  const validateDirectoryTitle = (directoryId: string, title: string) => {
    if (root) return null;

    return validateTitle(directoryId, title, getChildren());
  };

  const getChildren = () => calculateChildren(modules, directories, shortid);

  const setCurrentModule = (moduleId: string) => {
    moduleSelected({ id: moduleId });
  };

  const markTabsNotDirty = () => {
    moduleDoubleClicked();
  };

  const title = root ? 'Project' : directories.find(m => m.id === id).title;

  return connectDropTarget(
    <div style={{ position: 'relative' }}>
      <Overlay isOver={isOver && canDrop} />
      {!root && (
        <EntryContainer>
          <Entry
            id={id}
            shortid={shortid}
            title={title}
            depth={depth}
            type={open ? 'directory-open' : 'directory'}
            root={root}
            isOpen={open}
            onClick={toggleOpen}
            renameValidator={validateDirectoryTitle}
            discardModuleChanges={confirmDiscardChanges}
            rename={!root && renameDirectory}
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
        <Opener>
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
)(React.memo(DirectoryEntryElement));
