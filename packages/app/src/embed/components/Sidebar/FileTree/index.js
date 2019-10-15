import React from 'react';
import * as Icons from './icon';
import { FileContainer, IconContainer, FileName } from './elements';

function FileTree({ sandbox, currentModuleId, setCurrentModuleId }) {
  const { modules, directories } = sandbox;

  const allFiles = [...directories, ...modules].map(file => ({
      id: file.shortid,
      longid: file.id,
      title: file.title,
      directory: file.directoryShortid,
      type: file.code ? 'file' : 'directory',
    }));

  const selectedFile = allFiles.find(file => file.longid === currentModuleId);
  const onSelect = file => setCurrentModuleId(file.longid);

  return (
    <SubTree
      files={allFiles}
      allFiles={allFiles}
      selectedFile={selectedFile}
      onSelect={onSelect}
    />
  );
}

export default FileTree;

function SubTree({ files, allFiles, selectedFile, onSelect, ...props }) {
  return (
    <div>
      {files
        .filter(child => isRootLevel(files, child))
        .sort(sortingFunction)
        .map(child => (
          <React.Fragment key={child.id}>
            {child.type === 'directory' ? (
              <Directory
                files={files}
                allFiles={allFiles}
                selectedFile={selectedFile}
                onSelect={onSelect}
                {...child}
              />
            ) : (
              <File
                selectedFile={selectedFile}
                allFiles={allFiles}
                onClick={_ => onSelect(child)}
                {...child}
              />
            )}
          </React.Fragment>
        ))}
    </div>
  );
}

function Directory(props) {
  const children = props.allFiles.filter(file => file.directory === props.id);

  const defaultOpen = isChildSelected({
    allFiles: props.allFiles,
    directory: props,
    selectedFile: props.selectedFile,
  });

  const [open, setOpen] = React.useState(defaultOpen);
  const toggle = () => setOpen(!open);

  return (
    <>
      <File
        icon="ClosedDirectory"
        selectedFile={props.selectedFile}
        allFiles={props.allFiles}
        onClick={toggle}
        {...props}
      />
      {open ? (
        <SubTree
          files={children}
          allFiles={props.allFiles}
          selectedFile={props.selectedFile}
          onSelect={props.onSelect}
        />
      ) : null}
    </>
  );
}

function FileIcon({ name, extension }) {
  const Icon = Icons[extension] || Icons[name];
  return (
    <IconContainer>
      <Icon />
    </IconContainer>
  );
}

function File(props) {
  const selected = props.selectedFile.id === props.id;
  const depth = getDepth(props.allFiles, props);

  return (
    <FileContainer depth={depth} isSelected={selected} onClick={props.onClick}>
      <FileIcon name={props.icon || 'File'} />
      <FileName>{props.title}</FileName>
    </FileContainer>
  );
}

function sortingFunction(a, b) {
  // directories come first, sorted alphabetically
  // then files, also sorted alphabetically
  let first;

  if (a.type === b.type) {
    if (a.title < b.title) first = a;
    else first = b;
  } else if (a.type === 'directory') {
    first = a;
  } else {
    first = b;
  }

  // js be weird
  if (first === a) return -1;
  return 1;
}

function isRootLevel(files, file) {
  // find out if parent directory is in sub-tree

  const parentId = file.directory;
  if (!parentId) return true;

  const parent = files.find(file => file.id === parentId);
  if (!parent) return true;
}

function getDepth(allFiles, file) {
  let depth = 0;

  let parent = getParentDirectory(allFiles, file);

  while (parent) {
    depth++;
    parent = getParentDirectory(allFiles, parent);
  }

  return depth;
}

function isChildSelected({ allFiles, directory, selectedFile }) {
  const filesInCurrentSubTree = getFilesInSubTree(allFiles, selectedFile);

  return filesInCurrentSubTree.find(file => file.id === directory.id);
}

function getFilesInSubTree(allFiles, selectedFile) {
  const currentModuleTree = [selectedFile];

  let parentDirectory = getParentDirectory(allFiles, selectedFile);

  while (parentDirectory) {
    currentModuleTree.push(parentDirectory);
    // get parent directory of the parent directory
    parentDirectory = getParentDirectory(allFiles, parentDirectory);
  }

  return currentModuleTree;
}

function getParentDirectory(allFiles, file) {
  if (file.directory) {
    return allFiles.find(parent => parent.id === file.directory);
  }
}
