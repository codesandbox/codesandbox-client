import React from 'react';
import { Alert } from 'app/pages/common/Modals/Common/Alert';
import Modal from 'app/components/Modal';

interface DirectoryEntryModalProps {
  body: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  primaryMessage?: string;
}

export const DirectoryEntryModal = ({
  body,
  isOpen,
  onClose,
  onConfirm,
  primaryMessage,
  title,
}: DirectoryEntryModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} width={400}>
    <Alert
      title={title}
      description={body}
      onCancel={onClose}
      onPrimaryAction={onConfirm}
      type="danger"
      confirmMessage={primaryMessage || 'Delete'}
    />
  </Modal>
);
