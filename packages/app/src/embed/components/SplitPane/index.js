import React from 'react';
import SplitPane from 'react-split-pane';
import { isSmallMobileScreen } from 'embed/util/mobile';
import { GlobalActions, NavigationActions } from '../Actions';
import { Container, PaneContainer, RESIZER_WIDTH } from './elements';

export default function SplitView({
  showEditor,
  showPreview,
  isSmallScreen,
  sidebarOpen,
  children,
  showNavigationActions,
  refresh,
  openInNewWindow,
  sandbox,
  toggleLike,
  initialEditorSize = 50, // in percent
  initialPath,
  hideDevTools,
  setEditorSize,
  setDragging: setDraggingProp,
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

  const maxSize =
    (sidebarOpen ? windowWidth - sidebarWidth : windowWidth) - RESIZER_WIDTH;

  // #1. set initial size based on props
  let initialSize = null;

  if (showEditor && showPreview)
    initialSize = (initialEditorSize / 100) * maxSize;
  else if (showEditor && !showPreview) initialSize = maxSize;
  else if (showPreview && !showEditor) initialSize = 0;

  const [size, setSize] = React.useState(initialSize);

  React.useEffect(() => {
    setEditorSize(size);
  }, [size, setEditorSize]);

  // #2. We track dragging so that we can add an overlay on top
  // of the iframe which lets us keep focus on the resize toggle
  const [isDragging, setDragging] = React.useState(false);

  // #3. snap to edges, much logic, such wow.
  const handleAutomaticSnapping = newSize => {
    /* snap threshold on desktop is 50px on the left
      and 175px on the right (to keep the open sandbox button on one side)
      On mobile, it's 50% of the screen
    */
    const leftSnapThreshold = isSmallScreen ? maxSize / 2 : 50;
    const rightSnapThreshold = isSmallScreen ? maxSize / 2 : maxSize - 175;

    if (newSize === size) {
      /* if the size is unchanged, we assume it's a click.
          we don't rely on onResizerClick from react-split-pane
          because it requires the resizer to have some size which
          in our case isn't true because we artificially overlap
          the resizer on top of the preview/editor

          on mobile, we want to flip the current state.
          on desktop, we want to set it half if it's snapped to an edge.
       */
      if (isSmallScreen) setSize(size === 0 ? maxSize : 0);
      else if (size === 0 || size === maxSize) setSize(maxSize / 2);
    } else {
      // this means the user was able to drag
      // eslint-disable-next-line no-lonely-if
      if (newSize < leftSnapThreshold) setSize(0);
      else if (newSize > rightSnapThreshold) setSize(maxSize);
      else setSize(Math.min(newSize, maxSize));
    }
  };

  const onDragStarted = () => {
    setDragging(true);
    setDraggingProp(true);
  };

  const onDragFinished = newSize => {
    setDragging(false);
    setDraggingProp(false);

    // react-split-pane doesn't set newSize until
    // the end of the first drag, that breaks the click case
    // so we set it to the size that already is set
    handleAutomaticSnapping(newSize || size);

    setEditorSize(size);
  };

  const openEditor = () => {
    setSize(maxSize);
  };

  const openPreview = () => {
    setSize(0);
  };

  // TODO: #4. Handle edge case of keeping panes snapped
  // on window.resize and sidebar toggle

  /* We need at least 270px of space in the preview to
    fit global actions and navigation actions
    if there isn't enough space, navigation gets
    depririotized
  */
  const outOfSpaceForNavigation = maxSize - size < 270;

  /**
   * For small touch screens we show different buttons. We change for example that the
   * editor can be opened with a button
   */
  const smallTouchScreen = isSmallMobileScreen();

  return (
    <Container
      isDragging={isDragging}
      size={size}
      maxSize={maxSize}
      fullSize={size === maxSize}
    >
      <GlobalActions
        sandbox={sandbox}
        toggleLike={toggleLike}
        previewVisible={size < maxSize}
        isDragging={isDragging}
        offsetBottom={!hideDevTools && size < maxSize}
        openEditor={openEditor}
        openPreview={openPreview}
        smallTouchScreen={smallTouchScreen}
        initialPath={initialPath}
      />
      <SplitPane
        split="vertical"
        onDragStarted={onDragStarted}
        onDragFinished={onDragFinished}
        minSize="0%"
        maxSize={maxSize}
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
              offsetBottom={!hideDevTools && size < maxSize}
            />
          ) : null}
          {children[1]}
        </PaneContainer>
      </SplitPane>
    </Container>
  );
}
