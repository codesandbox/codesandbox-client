import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';
import * as computed from './computed';

export default Module({
  model,
  computed,
  state: {
    selectedSandboxes: [],
    orderBy: {
      field: 'updatedAt',
      order: 'desc',
    },
    filters: {
      blacklistedTemplates: [],
      search: '',
    },
    isDragging: false,
  },
  getters: {},
  signals: {
    dashboardMounted: sequences.loadDashboard,
    sandboxesSelected: sequences.selectSandboxes,
    dragChanged: sequences.setDragging,
    orderByChanged: sequences.setOrderBy,
    blacklistedTemplateAdded: sequences.addBlacklistedTemplate,
    blacklistedTemplateRemoved: sequences.removeBlacklistedTemplate,
    blacklistedTemplatesCleared: sequences.clearBlacklistedTemplates,
    blacklistedTemplatesChanged: sequences.setBlacklistedTemplates,
    searchChanged: sequences.changeSearch,
    createSandboxClicked: sequences.createSandbox,
  },
});
