import React from 'react';
import styled from 'styled-components';
import theme from 'common/theme';

import Tooltip from 'app/components/Tooltip';

const Tooltips = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const ViewIcon = styled.div`
  display: block;
  height: 1.75rem;
  transition: 0.3s ease all;
  position: relative;
  margin: 0 0.5rem;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;

  &:after {
    transition: 0.3s ease all;
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: 0; top: 0;
    background-color: rgba(0,0,0,0.6);
    opacity: ${props => (props.active ? 0 : 1)};
    border-radius: 2px;
    overflow: hidden;
  }
  &:hover::after {
    opacity: 0;
  }
`;

const Icon = styled.div`
  display: inline-block;
  width: ${props => props.size || (props.half ? 1.5 : 3)}rem;
  border: 1px solid rgba(0,0,0,0.1);
  height: 100%;
`;

export const EditorIcon = styled(Icon)`
  background-color: ${() => theme.secondary};
`;

export const PreviewIcon = styled(Icon)`
  background-color: ${() => theme.primary};
`;

type Props = {
  showEditor: boolean,
  showPreview: boolean,
  setEditorView: () => void,
  setPreviewView: () => void,
  setMixedView: () => void,
};

export default function AllIcons({
  showEditor,
  showPreview,
  setEditorView,
  setMixedView,
  setPreviewView,
}: Props) {
  return (
    <Tooltips>
      <Tooltip title="Editor view">
        <ViewIcon onClick={setEditorView} active={showEditor && !showPreview}>
          <EditorIcon />
        </ViewIcon>
      </Tooltip>
      <Tooltip title="Split view">
        <ViewIcon onClick={setMixedView} active={showEditor && showPreview}>
          <EditorIcon half />
          <PreviewIcon half />
        </ViewIcon>
      </Tooltip>
      <Tooltip title="Preview view">
        <ViewIcon onClick={setPreviewView} active={!showEditor && showPreview}>
          <PreviewIcon />
        </ViewIcon>
      </Tooltip>
    </Tooltips>
  );
}
