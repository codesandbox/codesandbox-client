// @flow
import React from 'react';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

const openModal = ({
  Body,
  title,
}: {
  Body: React.Element<*>,
  title: ?string,
}) => ({
  type: OPEN_MODAL,
  title,
  Body,
});

export default {
  openModal,
  closeModal: () => ({ type: CLOSE_MODAL }),
};
