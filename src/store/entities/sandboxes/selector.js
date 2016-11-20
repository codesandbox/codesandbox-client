export const sandboxesSelector = state => state.entities.sandboxes;
export const singleSandboxSelector = (state, { id }) => sandboxesSelector(state)[id];
