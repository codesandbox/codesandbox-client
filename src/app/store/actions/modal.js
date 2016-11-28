export const CLOSE_MODAL = 'CLOSE_MODAL';
export const CHANGE_MODAL = 'CHANGE_MODAL';

export default {
  changeModal: (template, params) => ({
    type: CHANGE_MODAL,
    template,
    params,
  }),
  closeModal: () => ({ type: CLOSE_MODAL }),
};
