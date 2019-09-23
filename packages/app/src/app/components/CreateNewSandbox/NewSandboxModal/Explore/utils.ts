export const makeTemplates = sandboxes =>
  sandboxes.map(sandbox => ({
    short_id: sandbox.objectID,
    ...sandbox,
    sandbox: {
      id: sandbox.objectID,
      ...sandbox,
      source: {
        ...sandbox,
      },
    },
    ...sandbox.custom_template,
  }));
