import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    selectedSandboxes: [],
    orderBy: {
      field: 'updated_at',
      order: 'desc',
    },
    isDragging: false,
  },
  getters: {},
  signals: {
    dashboardMounted: sequences.loadDashboard,
    sandboxesSelected: sequences.selectSandboxes,
    dragChanged: sequences.setDragging,
    orderByChanged: sequences.setOrderBy,
  },
});
