import React from 'react';

export interface IRenderTabsProps {
  isHovering: boolean;
  closeTab: (event: React.MouseEvent<any>) => void;
}

export interface ITabProps {
  title?: string;
  items?: any[];
  active?: boolean;
  dirty?: boolean;
  isOver?: boolean;
  position: number;
  tabCount: number;
  onClose: (position?: number) => void;
  onClick: () => void;
  onDoubleClick?: () => void;
  children: (props: IRenderTabsProps) => React.ReactNode;
}
