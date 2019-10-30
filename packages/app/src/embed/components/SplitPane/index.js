import React from 'react';
import SplitPane from 'react-split-pane';
import {
  Container,
  EditorContainer,
  IframeContainer,
  PointerOverlay,
} from './elements';

export default function({
  split,
  showEditor,
  showPreview,
  setEditorView,
  setPreviewView,
  ...props
}) {
  const [size, setSize] = React.useState('50%');

  const [isDragging, setDragging] = React.useState(false);
  const [totalSize, setTotalSize] = React.useState(null);
  const containerRef = React.useRef(null);

  // response to buttons in the header
  React.useEffect(() => {
    if (showEditor && showPreview) setSize('50%');
    else if (showEditor && !showPreview) setSize('100%');
    else if (showPreview && !showEditor) setSize('0%');
  }, [showEditor, showPreview]);

  React.useEffect(() => {
    const sizeProp = split === 'horizontal' ? 'offsetHeight' : 'offsetWidth';
    setTotalSize(
      containerRef.current ? containerRef.current[sizeProp] : Infinity
    );
  }, [containerRef, split]);

  // TODO: handle window resize

  // update with pixel size when we have the value
  // that's useful for the calculation in elements.Resizer
  React.useEffect(() => {
    if (size === '100%' && totalSize) setSize(totalSize);
  }, [size, totalSize]);

  // snap to edges
  const onDragFinished = width => {
    setDragging(false);
    if (width < 50) setSize(0);
    else if (width > totalSize - 50) setSize(totalSize);
    else setSize(width);
  };

  return (
    <Container
      isDragging={isDragging}
      ref={containerRef}
      size={size}
      totalSize={totalSize}
    >
      <SplitPane
        onDragStarted={() => setDragging(true)}
        onDragFinished={onDragFinished}
        minSize="0%"
        maxSize="100%"
        size={isDragging ? undefined : size}
        {...props}
      >
        <EditorContainer>{props.children[0]}</EditorContainer>
        <IframeContainer>
          {isDragging ? <PointerOverlay /> : null}
          {props.children[1]}
        </IframeContainer>
      </SplitPane>
    </Container>
  );
}
