import React, { useEffect } from 'react';

interface IHoverMenuProps {
  onClose: () => void;
}

// TODO: Rewrite this using Reakit for proper accessibility handling
const HoverMenu: React.FC<IHoverMenuProps> = ({ onClose, children }) => {
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

  return (
    <div role="menu" tabIndex={0} onClick={handleViewClick}>
      {children}
    </div>
  );
};

export default HoverMenu;
