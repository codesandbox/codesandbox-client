import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    selectedSandboxes: [],
    isDragging: false,
  },
  getters: {},
  signals: {
    dashboardMounted: sequences.loadDashboard,
    sandboxesSelected: sequences.selectSandboxes,
    dragChanged: sequences.setDragging,
  },
});
