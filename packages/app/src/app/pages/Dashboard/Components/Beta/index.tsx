import React from 'react';
import { useAppState } from 'app/overmind';
import { RepoBetaCard } from './RepoBetaCard';
import { RepoBetaListItem } from './RepoBetaListItem';
import { useSelection } from '../Selection';
import { DashboardBetaRepo } from '../../types';

export const RepoBeta = ({ ...props }: DashboardBetaRepo) => {
  const { dashboard } = useAppState();

  const Component =
    dashboard.viewMode === 'list' ? RepoBetaListItem : RepoBetaCard;

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
