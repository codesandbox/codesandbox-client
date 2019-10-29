import React from 'react';
import SplitPane from 'react-split-pane';
import { Container, PreviewContainer, PointerOverlay } from './elements';

export default function(props) {
  const [isDragging, setDragging] = React.useState(false);

  return (
    <Container isDragging={isDragging}>
      <SplitPane
        onDragStarted={() => setDragging(true)}
        onDragFinished={() => setDragging(false)}
        {...props}
      >
        <div>{props.children[0]}</div>
        <PreviewContainer>
          {isDragging ? <PointerOverlay /> : null}
          {props.children[1]}
        </PreviewContainer>
      </SplitPane>
    </Container>
  );
}
