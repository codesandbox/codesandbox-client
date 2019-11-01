import React from 'react';
import SplitPane from 'react-split-pane';
import { Container, PaneContainer, PointerOverlay } from './elements';

export default function SplitView({
  showEditor,
  showPreview,
  isMobile,
  sidebarOpen,
  children,
  ...props
}) {
  /* Things this component should do
    1. set inital size based on props
    2. let user move it around
    3. snap to edges
    4. stay snapped on window.resize and sidebar toggle (not implemented)
  */

  const windowWidth = window.innerWidth;
  // TODO: pick this from the sidebar or ref instead of hardcoding
  const sidebarWidth = 250;

  const maxSize = sidebarOpen ? windowWidth - sidebarWidth : windowWidth;

  // #1. set initial size based on props
  let initialSize = null;
  if (showEditor && showPreview) initialSize = maxSize / 2;
  else if (showEditor && !showPreview) initialSize = maxSize;
  else if (showPreview && !showEditor) initialSize = 0;

  const [size, setSize] = React.useState(initialSize);

  // #2. We track dragging so that we can add an overlay on top
  // of the iframe which lets us keep focus on the resize toggle
  const [isDragging, setDragging] = React.useState(false);

  const onDragStarted = () => setDragging(true);
  const onDragFinished = width => {
    // #3. snap to edges
    // snap threshold on desktop is0 50px
    // on mobile, it's 50% of the screen
    setDragging(false);

    const leftSnapThreshold = isMobile ? maxSize / 2 : 50;
    const rightSnapThreshold = isMobile ? maxSize / 2 : maxSize - 50;

    if (width < leftSnapThreshold) setSize(0);
    else if (width > rightSnapThreshold) setSize(maxSize);
    else setSize(width);
  };

  // TODO: Handle edge case of keeping panes snapped
  // on window.resize and sidebar toggle

  return (
    <Container isDragging={isDragging} size={size} maxSize={maxSize}>
      <SplitPane
        split="vertical"
        onDragStarted={onDragStarted}
        onDragFinished={onDragFinished}
        minSize="0%"
        maxSize="100%"
        size={size}
        {...props}
      >
        <PaneContainer>{children[0]}</PaneContainer>
        <PaneContainer>
          {isDragging ? <PointerOverlay /> : null}
          {children[1]}
        </PaneContainer>
      </SplitPane>
    </Container>
  );
}
