import React from 'react';
import SplitPane from 'react-split-pane';
import { Container, IframeContainer, PointerOverlay } from './elements';

export default function(props) {
  const [isDragging, setDragging] = React.useState(false);
  const [size, setSize] = React.useState('50%');
  const containerRef = React.useRef(null);

  // snap to edges
  const onChange = width => {
    const totalWidth = containerRef.current.offsetWidth;
    if (width < 50) setSize(0);
    else if (width > totalWidth - 50) setSize(totalWidth);
    else setSize(width);
  };

  return (
    <Container isDragging={isDragging} ref={containerRef}>
      <SplitPane
        onDragStarted={() => setDragging(true)}
        onDragFinished={() => setDragging(false)}
        onChange={onChange}
        minSize="0%"
        maxSize="100%"
        size={isDragging ? undefined : size}
        {...props}
      >
        <div>{props.children[0]}</div>
        <IframeContainer>
          {isDragging ? <PointerOverlay /> : null}
          {props.children[1]}
        </IframeContainer>
      </SplitPane>
    </Container>
  );
}
