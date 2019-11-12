import React from 'react';
import SplitPane from 'react-split-pane';
import { GlobalActions, NavigationActions } from '../Actions';
import { Container, PaneContainer, PointerOverlay } from './elements';

export default function SplitView({
  showEditor,
  showPreview,
  isMobile,
  sidebarOpen,
  children,
  showNavigationActions,
  refresh,
  openInNewWindow,
  sandbox,
  toggleLike,
  initialEditorSize = 50, // in percent
  ...props
}) {
  /* Things this component should do
    1. set inital size based on props
    2. let user move it around
    3. snap to edges
    4. stay snapped on window.resize and sidebar toggle (not implemented)
    5. introduce the resizer element with animation
  */

  const windowWidth = document.body.clientWidth;
  // TODO: pick this from the sidebar or ref instead of hardcoding
  const sidebarWidth = 250;

  const maxSize = sidebarOpen ? windowWidth - sidebarWidth : windowWidth;

  // #1. set initial size based on props
  let initialSize = null;

  if (showEditor && showPreview)
    initialSize = (initialEditorSize / 100) * maxSize;
  else if (showEditor && !showPreview) initialSize = maxSize;
  else if (showPreview && !showEditor) initialSize = 0;

  const [size, setSize] = React.useState(initialSize);

  // #2. We track dragging so that we can add an overlay on top
  // of the iframe which lets us keep focus on the resize toggle
  const [isDragging, setDragging] = React.useState(false);

  // #3. snap to edges, much logic, such wow.
  const handleAutomaticSnapping = newSize => {
    /* snap threshold on desktop is 50px on the left
      and 175px on the right (to keep the open sandbox button on one side)
      On mobile, it's 50% of the screen
    */
    const leftSnapThreshold = isMobile ? maxSize / 2 : 50;
    const rightSnapThreshold = isMobile ? maxSize / 2 : maxSize - 175;

    if (newSize === size) {
      /* if the size is unchanged, we assume it's a click.
          we don't rely on onResizerClick from react-split-pane
          because it requires the resizer to have some size which
          in our case isn't true because we artificially overlap
          the resizer on top of the preview/editor

          on mobile, we want to flip the current state.
          on desktop, we want to set it half if it's snapped to an edge.
       */
      if (isMobile) setSize(size === 0 ? maxSize : 0);
      else if (size === 0 || size === maxSize) setSize(maxSize / 2);
    } else {
      // this means the user was able to drag
      // eslint-disable-next-line no-lonely-if
      if (newSize < leftSnapThreshold) setSize(0);
      else if (newSize > rightSnapThreshold) setSize(maxSize);
      else setSize(newSize);
    }
  };

  const onDragStarted = () => setDragging(true);

  const onDragFinished = newSize => {
    setDragging(false);

    // react-split-pane doesn't set newSize until
    // the end of the first drag, that breaks the click case
    // so we set it to the size that already is set
    handleAutomaticSnapping(newSize || size);
  };

  // TODO: #4. Handle edge case of keeping panes snapped
  // on window.resize and sidebar toggle

  // #5. Intoduce resizer on first mouse over
  // there is no mousover on mobile, so we introduce on load
  const [hasAttention, setAttention] = React.useState(!!isMobile);
  const [hasBeenIntroduced, setHasBeenIntroduction] = React.useState(false);
  const ANIMATION_DURATION = 3000;

  const onMouseOver = () => {
    // this should run only once
    if (hasAttention) return;

    setAttention(true);
    window.setTimeout(() => {
      setHasBeenIntroduction(true);
    }, ANIMATION_DURATION);
  };

  /* We need at least 270px of space in the preview to
    fit global actions and navigation actions
    if there isn't enough space, navigation gets
    depririotized
  */
  const outOfSpaceForNavigation = maxSize - size < 270;

  return (
    <Container
      isDragging={isDragging}
      size={size}
      maxSize={maxSize}
      fullSize={size === maxSize}
      hasAttention={hasAttention}
      onMouseOver={onMouseOver}
      onFocus={onMouseOver}
      hasBeenIntroduced={hasBeenIntroduced}
    >
      <GlobalActions
        sandbox={sandbox}
        toggleLike={toggleLike}
        previewVisible={size < maxSize}
        isDragging={isDragging}
      />
      <SplitPane
        split="vertical"
        onDragStarted={onDragStarted}
        onDragFinished={onDragFinished}
        minSize="0%"
        maxSize="100%"
        onMouseEnter={onDragStarted}
        size={size}
        {...props}
      >
        <PaneContainer>{children[0]}</PaneContainer>
        <PaneContainer>
          {showNavigationActions && !outOfSpaceForNavigation ? (
            <NavigationActions
              refresh={refresh}
              openInNewWindow={openInNewWindow}
              isDragging={isDragging}
            />
          ) : null}
          {isDragging ? <PointerOverlay /> : null}
          {children[1]}
        </PaneContainer>
      </SplitPane>
    </Container>
  );
}
