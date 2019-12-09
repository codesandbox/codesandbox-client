import { mapKeys } from 'lodash-es';
import toml from 'markty-toml';

export default sandbox => {
  const netlifyConfig = sandbox.modules
    .filter(
      module =>
        module.title === 'netlify.toml' && module.directoryShortid == null
    )
    .map(m => toml(m.code))[0] || { build: {} };

  return mapKeys(netlifyConfig.build, (v, k) => k.toLowerCase());
};
