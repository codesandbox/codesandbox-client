import React from 'react';
import styled, { keyframes } from 'styled-components';

import Tooltip from 'common/components/Tooltip';

const showAnimationKeyframes = keyframes`
  0%   { opacity: 0; transform: translateX(10px); }
  100% { opacity: 1; transform: translateX(0px); }
`;

const reverseShowAnimationKeyframes = keyframes`
  0%   { opacity: 0; transform: translateX(-10px); }
  100% { opacity: 1; transform: translateX(0px); }
`;

const showAnimation = (delay: number = 0, reverse: boolean = true) =>
  `
    animation: ${reverse
      ? reverseShowAnimationKeyframes
      : showAnimationKeyframes} 0.3s;
    animation-delay: ${delay}s;
    animation-fill-mode: forwards;
    opacity: 0;
  `;

const hideAnimationKeyframes = keyframes`
  0%   { opacity: 1; transform: translateX(0px); }
  100% { opacity: 0; transform: translateX(10px); }
`;

const reverseHideAnimationKeyframes = keyframes`
  0%   { opacity: 1; transform: translateX(0px); }
  100% { opacity: 0; transform: translateX(-10px); }
`;

const hideAnimation = (delay: number = 0, reverse: boolean = true) =>
  `
    animation: ${reverse
      ? reverseHideAnimationKeyframes
      : hideAnimationKeyframes} 0.3s;
    animation-delay: ${delay}s;
    animation-fill-mode: forwards;
    opacity: 1;
  `;

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
  height: 1.75rem;
  transition: 0.3s ease all;
  position: relative;
  margin: 0 0.5rem;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;

  &:after {
    transition: 0.3s ease all;
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: ${props => (props.active ? 0 : 1)};
    border-radius: 2px;
    overflow: hidden;
  }
  &:hover::after {
    opacity: 0;
  }
`;

const Hover = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

const SubMode = styled.div`
  ${props =>
    props.hovering
      ? showAnimation(props.i * 0.05, props.i === 1)
      : hideAnimation(props.i * 0.05, props.i === 1)};
`;

const Icon = styled.div`
  display: inline-block;
  width: ${({ half }) =>
    half ? `calc(1.5rem - 1px)` : `3rem`}; /* 1px is for the middle border */
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 100%;
`;

export const EditorIcon = styled(Icon)`
  background-color: ${({ theme }) => theme.templateColor || theme.secondary};
`;

export const PreviewIcon = styled(Icon)`
  background-color: ${({ theme }) => theme.primary};
`;

type Props = {
  showEditor: boolean,
  showPreview: boolean,
  setEditorView: () => void,
  setPreviewView: () => void,
  setMixedView: () => void,
  dropdown: boolean,
};

const getCurrentMode = ({
  showEditor,
  showPreview,
  setMixedView,
  setEditorView,
  setPreviewView,
}: Props) => {
  const both = (
    <Tooltip title="Show Split view">
      <ViewIcon onClick={setMixedView} active={showEditor && showPreview}>
        <EditorIcon half />
        <PreviewIcon half />
      </ViewIcon>
    </Tooltip>
  );

  const editor = (
    <Tooltip title="Show Editor view">
      <ViewIcon onClick={setEditorView} active={showEditor && !showPreview}>
        <EditorIcon />
      </ViewIcon>
    </Tooltip>
  );

  const preview = (
    <Tooltip title="Show Preview view">
      <ViewIcon onClick={setPreviewView} active={!showEditor && showPreview}>
        <PreviewIcon />
      </ViewIcon>
    </Tooltip>
  );

  if (showEditor && !showPreview)
    return { currentMode: editor, otherModes: [both, preview] };
  if (!showEditor && showPreview)
    return { currentMode: preview, otherModes: [editor, both] };

  return { currentMode: both, otherModes: [editor, preview] };
};

export default class ModeIcons extends React.PureComponent<Props> {
  constructor(props) {
    super(props);

    const { currentMode, otherModes } = getCurrentMode(this.props);

    this.state = {
      hovering: false,
      showSubmodes: false,
      currentMode,
      otherModes,
    };
  }

  onMouseEnter = () => {
    this.setState({
      showSubmodes: true,
      hovering: true,
    });
  };

  onMouseLeave = () => {
    this.setState({
      hovering: false,
    });
  };

  onAnimationEnd = () => {
    const { currentMode, otherModes } = getCurrentMode(this.props);

    if (!this.state.hovering) {
      this.setState({
        showSubmodes: false,
        currentMode,
        otherModes,
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    const { currentMode, otherModes } = getCurrentMode(nextProps);

    if (!this.state.hovering) {
      this.setState({
        currentMode,
        otherModes,
      });
    } else {
      this.setState({
        currentMode,
      });
    }
  }

  render() {
    const {
      showEditor,
      showPreview,
      setEditorView,
      setMixedView,
      setPreviewView,
      dropdown,
    } = this.props;

    const { hovering, showSubmodes, currentMode, otherModes } = this.state;

    if (dropdown) {
      return (
        <Tooltips>
          <Hover onMouseLeave={this.onMouseLeave}>
            {showSubmodes && (
              <SubMode
                onClick={this.onMouseLeave}
                onAnimationEnd={this.onAnimationEnd}
                hovering={hovering}
                i={0}
              >
                {otherModes[0]}
              </SubMode>
            )}
            <div onMouseEnter={this.onMouseEnter}>{currentMode}</div>
            {showSubmodes && (
              <SubMode
                onClick={this.onMouseLeave}
                onAnimationEnd={this.onAnimationEnd}
                hovering={hovering}
                i={1}
              >
                {otherModes[1]}
              </SubMode>
            )}
          </Hover>
        </Tooltips>
      );
    }

    return (
      <Tooltips>
        <Tooltip title="Show Editor view">
          <ViewIcon onClick={setEditorView} active={showEditor && !showPreview}>
            <EditorIcon />
          </ViewIcon>
        </Tooltip>
        <Tooltip title="Show Split view">
          <ViewIcon onClick={setMixedView} active={showEditor && showPreview}>
            <EditorIcon half />
            <PreviewIcon half />
          </ViewIcon>
        </Tooltip>
        <Tooltip title="Show Preview view">
          <ViewIcon
            onClick={setPreviewView}
            active={!showEditor && showPreview}
          >
            <PreviewIcon />
          </ViewIcon>
        </Tooltip>
      </Tooltips>
    );
  }
}
