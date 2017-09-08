// @flow
import { schema } from 'normalizr';

const getDefaultCode = module => {
  if (module.title.endsWith('.vue')) {
    return `<template>

</template>

<script>
export default {

}
</script>
`;
  }

  return '';
};

export default new schema.Entity(
  'modules',
  {},
  {
    processStrategy: module => {
      const newCode = getDefaultCode(module);

      const isNotSynced = newCode !== '';
      return {
        ...module,
        errors: [],
        code: module.code || newCode,
        isNotSynced: module.code ? false : isNotSynced,
      };
    },
  }
);
