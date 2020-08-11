import React from 'react';
import * as Icons from './icons';
import { FileContainer, IconContainer, FileName } from './elements';
import {
  sortingFunction,
  isRootLevel,
  getDepth,
  isChildSelected,
} from './utils';

function FileTree({ sandbox, currentModuleId, setCurrentModuleId }) {
  const { modules, directories } = sandbox;

  const allFiles = [...directories, ...modules].map(file => ({
    id: file.shortid,
    longid: file.id,
    title: file.title,
    directory: file.directoryShortid,
    // this line is so silly because we already know directories
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

function SubTree({ files, allFiles, selectedFile, onSelect }) {
  return (
    <div>
      {files
        .filter(child => isRootLevel(files, child))
        .sort(sortingFunction)
        .map(child => (
          <React.Fragment key={child.id}>
            {child.type === 'directory' ? (
              <Directory
                className="directory"
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
                onClick={() => onSelect(child)}
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

function FileIcon(props) {
  return (
    <IconContainer>
      {props.type === 'directory' ? (
        <Icons.Directory />
      ) : (
        <Icons.File {...props} />
      )}
    </IconContainer>
  );
}

function File(props) {
  const selected = props.selectedFile.id === props.id;
  const depth = getDepth(props.allFiles, props);

  return (
    <FileContainer depth={depth} isSelected={selected} onClick={props.onClick}>
      <FileIcon {...props} />
      <FileName>{props.title}</FileName>
    </FileContainer>
  );
}
