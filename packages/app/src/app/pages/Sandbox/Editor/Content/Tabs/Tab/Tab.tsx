import React, { useState } from 'react';
import ContextMenu from 'app/components/ContextMenu';
import { Container, TabTitle, StyledCloseIcon } from './elements';

export interface IRenderTabsProps {
  isHovering: boolean;
  closeTab: (event: React.MouseEvent<any>) => void;
}

interface ITabProps {
  title: string;
  items: any[];
  active: boolean;
  dirty: boolean;
  isOver: boolean;
  position: number;
  tabCount: number;
  onClose: (position?: number) => void;
  onClick: () => void;
  onDoubleClick: () => void;
  children: (props: IRenderTabsProps) => React.ReactNode;
}

export const Tab: React.FC<ITabProps> = ({
  active,
  dirty,
  isOver,
  position,
  tabCount,
  onClose = () => {},
  onClick,
  onDoubleClick,
  children,
  title,
  items,
}) => {
  const [isHovering, setHovering] = useState(false);

  const handleCloseTab = (e: React.MouseEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose(position);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      // Middle mouse button
      handleCloseTab(e);
    }
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
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {title ? (
          <>
            <TabTitle>{title}</TabTitle>
            <StyledCloseIcon
              onClick={handleCloseTab}
              show={isHovering && tabCount > 1}
            />
          </>
        ) : (
          children({ isHovering, closeTab: handleCloseTab })
        )}
      </Container>
    </ContextMenu>
  );
};
