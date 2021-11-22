import React from 'react';
import { RepoBetaListItem } from './RepoBetaListItem';
import { useSelection } from '../Selection';
import { DashboardBetaRepo } from '../../types';

export const RepoBeta = ({ ...props }: DashboardBetaRepo) => {
  const Component = RepoBetaListItem;

  // interactions
  const { onMouseDown, onBlur } = useSelection();

  const interactionProps = {
    tabIndex: 0, // make div focusable
    style: { outline: 'none' }, // we handle outline with border
    onMouseDown,
    onBlur,
  };

  return <Component {...interactionProps} {...props} />;
};
