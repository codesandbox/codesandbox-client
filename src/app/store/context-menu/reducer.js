// @flow
import * as React from 'react';
import * as actions from './actions';

export type ContextMenuItem = {
  title: string,
  action: Function,
  icon?: React.Component<any, any>,
  color: ?string,
};

export type ContextMenuState = {
  show: boolean,
  items: Array<ContextMenuItem>,
  x: number,
  y: number,
  onClose?: Function,
};

const initialState: ContextMenuState = {
  show: false,
  items: [],
  x: 0,
  y: 0,
};

export default function reducer(
  state: ContextMenuState = initialState,
  action: Object
) {
  switch (action.type) {
    case actions.CLOSE_CONTEXT_MENU:
      return {
        ...state,
        show: false,
      };
    case actions.OPEN_CONTEXT_MENU:
      return {
        ...state,
        items: action.items,
        x: action.x,
        y: action.y,
        onClose: action.onClose,
        show: true,
      };
    default:
      return state;
  }
}
