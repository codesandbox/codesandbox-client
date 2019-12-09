import React, { useState } from 'react';
import {
  Tooltips,
  ViewIcon,
  Hover,
  SubMode,
  EditorIcon,
  PreviewIcon,
} from './elements';

interface IModeIconsProps {
  dropdown: boolean;
  showEditor: boolean;
  showPreview: boolean;
  onSetMixedView: () => void;
  onSetEditorView: () => void;
  onSetPreviewView: () => void;
}

export const ModeIcons: React.FC<IModeIconsProps> = ({
  dropdown,
  showEditor,
  showPreview,
  onSetMixedView,
  onSetEditorView,
  onSetPreviewView,
}) => {
  const [isHovering, setHovering] = useState(false);
  const [showSubmodes, setShowSubmode] = useState(false);

  const onMouseEnter = () => {
    setHovering(true);
    setShowSubmode(true);
  };

  const onMouseLeave = () => {
    setHovering(false);
  };

  const onAnimationEnd = () => {
    if (!isHovering) {
      setShowSubmode(false);
    }
  };

  const editorView = (
    <ViewIcon onClick={onSetEditorView} active={showEditor && !showPreview}>
      <EditorIcon />
    </ViewIcon>
  );

  const mixedView = (
    <ViewIcon onClick={onSetMixedView} active={showEditor && showPreview}>
      <EditorIcon half />
      <PreviewIcon half />
    </ViewIcon>
  );

  const previewView = (
    <ViewIcon onClick={onSetPreviewView} active={!showEditor && showPreview}>
      <PreviewIcon />
    </ViewIcon>
  );

  const getCurrentMode = () => {
    if (showEditor && !showPreview) {
      return { currentMode: editorView, otherModes: [mixedView, previewView] };
    }
    if (!showEditor && showPreview) {
      return { currentMode: previewView, otherModes: [editorView, mixedView] };
    }
    return { currentMode: mixedView, otherModes: [editorView, previewView] };
  };

  const { currentMode, otherModes } = getCurrentMode();

  return dropdown ? (
    <Tooltips>
      <Hover onMouseLeave={onMouseLeave}>
        {showSubmodes && (
          <SubMode
            onClick={onMouseLeave}
            onAnimationEnd={onAnimationEnd}
            hovering={isHovering}
            i={0}
          >
            {otherModes[0]}
          </SubMode>
        )}
        <div onMouseEnter={onMouseEnter}>{currentMode}</div>
        {showSubmodes && (
          <SubMode
            onClick={onMouseLeave}
            onAnimationEnd={onAnimationEnd}
            hovering={isHovering}
            i={1}
          >
            {otherModes[1]}
          </SubMode>
        )}
      </Hover>
    </Tooltips>
  ) : (
    <Tooltips>
      {editorView}
      {mixedView}
      {previewView}
    </Tooltips>
  );
};
