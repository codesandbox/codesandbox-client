import React, { useState } from 'react';
import ContextMenu from 'app/components/ContextMenu';
import { Container, TabTitle, StyledCloseIcon } from './elements';

export const Tab = ({
  active,
  dirty,
  isOver,
  position,
  tabCount,
  closeTab,
  onClick,
  onDoubleClick,
  children,
  title,
  items,
}) => {
  const [isHovering, setHovering] = useState(false);

  const handleMouseEnter = () => setHovering(true);

  const handleMouseLeave = () => setHovering(false);

  const handleCloseTab = e => {
    e.preventDefault();
    e.stopPropagation();

    if (closeTab) {
      closeTab(position);
    }
  };

  const onMouseDown = e => {
    if (e.button === 1) {
      // Middle mouse button
      handleCloseTab(e);
    }
  };

  const renderTabStatus = () => {
    if (isHovering && tabCount > 1) {
      return <StyledCloseIcon onClick={handleCloseTab} show={'true'} />;
    }

    return <StyledCloseIcon onClick={handleCloseTab} show={undefined} />;
  };

  return (
    <ContextMenu style={{ height: 'calc(100% - 1px)' }} items={items || []}>
      <Container
        active={active}
        dirty={dirty}
        isOver={isOver}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {title ? (
          <>
            <TabTitle>{title}</TabTitle>
            {renderTabStatus()}
          </>
        ) : (
          children({ isHovering, closeTab: handleCloseTab })
        )}
      </Container>
    </ContextMenu>
  );
};
