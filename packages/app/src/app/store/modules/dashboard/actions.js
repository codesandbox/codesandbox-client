export const removeBlacklistedTemplate = ({ state, props }) => {
  state.set(
    'dashboard.filters.blacklistedTemplates',
    state
      .get('dashboard.filters.blacklistedTemplates')
      .filter(x => x !== props.template)
  );

  return {};
};
