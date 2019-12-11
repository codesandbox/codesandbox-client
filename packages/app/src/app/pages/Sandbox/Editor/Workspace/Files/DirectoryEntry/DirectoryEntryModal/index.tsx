import React from 'react';
import { Alert } from 'app/components/Alert';
import Modal from 'app/components/Modal';

interface DirectoryEntryModalProps {
  body: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DirectoryEntryModal = ({
  body,
  isOpen,
  onClose,
  onConfirm,
  title,
}: DirectoryEntryModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} width={400}>
    <Alert
      css={`
        background-color: ${props =>
          props.theme['sideBar.background'] || 'auto'};
        color: ${props =>
          props.theme.light ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)'};
      `}
      title={title}
      body={body}
      onCancel={onClose}
      onConfirm={onConfirm}
    />
  </Modal>
);

export default DirectoryEntryModal;
