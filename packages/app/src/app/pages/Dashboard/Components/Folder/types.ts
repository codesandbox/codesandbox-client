import React from 'react';

export interface FolderItemComponentProps {
  name: string;
  path: string;
  numberOfSandboxes: number;
  // interactions
  selected: boolean;
  onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  onDoubleClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  onContextMenu?: (evt: React.MouseEvent) => void;
  // editing
  editing: boolean;
  isNewFolder: boolean;
  isDragging?: boolean;
  newName: string;
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void;
  onInputKeyDown: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (evt: React.FormEvent<HTMLFormElement>) => void;
  onInputBlur: (evt: React.FocusEvent<HTMLInputElement>) => void;
  // drop target
  showDropStyles?: boolean;
  // drag preview
  thumbnailRef?: React.Ref<HTMLDivElement>;

  'data-selection-id'?: string;
}
