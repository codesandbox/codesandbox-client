import React from 'react';
import SplitPane from 'react-split-pane';
import { Container, IframeContainer, PointerOverlay } from './elements';

export default function(props) {
  const [isDragging, setDragging] = React.useState(false);
  const [size, setSize] = React.useState(props.defaultSize);
  const [totalSize, setTotalSize] = React.useState(null);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    setTotalSize(
      containerRef.current ? containerRef.current.offsetWidth : Infinity
    );
  }, [containerRef]);

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
        <>{props.children[0]}</>
        <IframeContainer>
          {isDragging ? <PointerOverlay /> : null}
          {props.children[1]}
        </IframeContainer>
      </SplitPane>
    </Container>
  );
}
