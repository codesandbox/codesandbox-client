import isEqual from 'lodash-es/isEqual';

export const minify = styles => {
  const output = [];

  styles.forEach(style => {
    const item = output.find(x => isEqual(style.settings, x.style));

    if (!item) {
      output.push({
        types: [style.scope],
        style: style.settings,
      });
    } else {
      item.types.push(style.scope);
    }
  });

  return output;
};
