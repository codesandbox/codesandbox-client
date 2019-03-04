import React from 'react';
import Button from 'common/lib/components/Button';
import Modal from '../../components/Modal';

import { Title } from './_sidebar.elements';

export default ({ isOpen, loading, onClose, onClick }) => (
  <Modal isOpen={isOpen} width={400}>
    <Title>Are you sure?</Title>
    <p>
      You can email us in the next 24 hours at{' '}
      <a href="mailto@codesandbox.io">hello@codesandbox.io</a> to revert the
      deleting.
    </p>
    <footer
      css={`
        margin-top: 30px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-content: center;
        grid-column-gap: 40px;
      `}
    >
      <Button small disabled={loading} onClick={onClose}>
        No, Keep Account
      </Button>
      <Button small disabled={loading} danger onClick={onClick}>
        Close Account
      </Button>
    </footer>
  </Modal>
);
