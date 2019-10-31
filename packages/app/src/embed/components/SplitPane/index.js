import React from 'react';
import SplitPane from 'react-split-pane';
import { Container, PaneContainer, PointerOverlay } from './elements';

export default function({
  showEditor,
  showPreview,
  setEditorView,
  setPreviewView,
  ...props
}) {
  const [size, setSize] = React.useState('50%');

  const [isDragging, setDragging] = React.useState(false);
  const [totalSize, setTotalSize] = React.useState(null);
  const [snapped, setSnapped] = React.useState(false);
  const containerRef = React.useRef(null);

  // response to buttons in the header
  // if there is no header, this can go in the default
  React.useEffect(() => {
    if (showEditor && showPreview) setSize('50%');
    else if (showEditor && !showPreview) setSize('100%');
    else if (showPreview && !showEditor) setSize('0%');
  }, [showEditor, showPreview]);

  // update max size possible based on  width of container
  function updateTotalSize() {
    setTotalSize(
      containerRef.current ? containerRef.current.offsetWidth : Infinity
    );
  }

  // update total size in pixels when it's ready, useful for:
  // 1. calculation in elements.Resizer
  // 2. window resize events
  React.useEffect(() => {
    updateTotalSize();
  }, [containerRef, updateTotalSize]);

  // update size when totalSize changes
  React.useEffect(() => {
    if (size === '100%' && totalSize) setSize(totalSize);
    else if (snapped === 'right') setSize(totalSize);
    else if (size === '50%' && totalSize) setSize(totalSize / 2);
  }, [totalSize, snapped, size]);

  // handle browser window resize
  React.useEffect(() => {
    const handleResize = () => {
      updateTotalSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [totalSize, updateTotalSize]);

  // snap to edges
  const onDragFinished = width => {
    setDragging(false);
    if (width < 50) setSize(0);
    else if (width > totalSize - 50) setSize(totalSize);
    else setSize(width);
  };

  // sync snapped state based on size
  React.useEffect(() => {
    if (size === 0) setSnapped('left');
    else if (size === totalSize) setSnapped('right');
    else setSnapped('none');
  }, [size, totalSize]);

  return (
    <Container
      isDragging={isDragging}
      ref={containerRef}
      size={size}
      totalSize={totalSize}
    >
      <SplitPane
        split="vertical"
        onDragStarted={() => setDragging(true)}
        onDragFinished={onDragFinished}
        minSize="0%"
        maxSize="100%"
        size={isDragging ? undefined : size}
        {...props}
      >
        <PaneContainer>{props.children[0]}</PaneContainer>
        <PaneContainer>
          {isDragging ? <PointerOverlay /> : null}
          {props.children[1]}
        </PaneContainer>
      </SplitPane>
    </Container>
  );
}
