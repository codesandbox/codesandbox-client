import React, { useEffect } from 'react';

interface IHoverMenuProps {
  onClose: () => void;
  children: React.ReactNode;
}

const HoverMenu = ({ onClose, children }: IHoverMenuProps) => {
  useEffect(() => {
    const handleDocumentClick = () => {
      onClose();
    };

    document.addEventListener('click', handleDocumentClick);

    return () => document.removeEventListener('click', handleDocumentClick);
  }, [onClose]);

  const handleViewClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  return <div onClick={handleViewClick}>{children}</div>;
};

export default HoverMenu;
