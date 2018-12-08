import React from 'react';
import Tooltip from 'common/components/Tooltip';
import {
  Tooltips,
  ViewIcon,
  Hover,
  SubMode,
  EditorIcon,
  PreviewIcon,
} from './elements';

function getCurrentMode({
  showEditor,
  showPreview,
  setMixedView,
  setEditorView,
  setPreviewView,
}) {
  const both = (
    <Tooltip touchHold title="Show Split view">
      <ViewIcon onClick={setMixedView} active={showEditor && showPreview}>
        <EditorIcon half />
        <PreviewIcon half />
      </ViewIcon>
    </Tooltip>
  );

  const editor = (
    <Tooltip touchHold title="Show Editor view">
      <ViewIcon onClick={setEditorView} active={showEditor && !showPreview}>
        <EditorIcon />
      </ViewIcon>
    </Tooltip>
  );

  const preview = (
    <Tooltip touchHold title="Show Preview view">
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
}

export default class ModeIcons extends React.PureComponent {
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
        <Tooltip title="Editor View">
          <ViewIcon onClick={setEditorView} active={showEditor && !showPreview}>
            <EditorIcon />
          </ViewIcon>
        </Tooltip>
        <Tooltip title="Split View">
          <ViewIcon onClick={setMixedView} active={showEditor && showPreview}>
            <EditorIcon half />
            <PreviewIcon half />
          </ViewIcon>
        </Tooltip>
        <Tooltip title="Preview View">
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
