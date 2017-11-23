// @flow
import * as React from 'react';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

const openModal = ({
  Body,
  title,
  width,
}: {
  Body: React.Element<any>,
  title: ?string,
  width?: number,
}) => ({
  type: OPEN_MODAL,
  title,
  width,
  Body,
});

export default {
  openModal,
  closeModal: () => ({ type: CLOSE_MODAL }),
};
