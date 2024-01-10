/* eslint-disable */
import { extname } from '@codesandbox/common/lib/utils/path';
import detectiveListener from './wrap-listener';

const LOADERS = {
  css: [],
  sass: ['sass-loader?indentedSyntax=1'],
  scss: ['sass-loader'],
  less: ['less-loader'],
  styl: ['stylus-loader'],
  stylus: ['stylus-loader'],
};

/**
 * Converts all named imports to a loader syntax that specifies it as a css module.
 *
 * Example:
 * import styles from './styles.css';
 *
 * will be converted to
 * import styles from '!style-loader?module=true!./styles.css';
 *
 * and
 * import './styles.css;
 *
 * will not be converted
 */
export default detectiveListener(path => {
  if (
    path.container &&
    path.container.specifiers &&
    path.container.specifiers.length > 0
  ) {
    const val = path.node.value;
    let ext = extname(val);

    if (ext) {
      // Remove the dot
      ext = ext.substr(1);
    }

    const loaders = LOADERS[ext];

    if (loaders != null) {
      const newValue =
        '!style-loader?module=true!' + loaders.join('!') + '!' + val;
      path.node.value = newValue; // eslint-disable-line no-param-reassign
    }
  }
}, 'css-modules-converter');
