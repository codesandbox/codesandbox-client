import { createElement, Fragment } from 'react';

const renderTitle = (label: string) => {
  const matches = /(&&\w)/g.exec(label);
  const cleanLabel = label.replace(/&&/, '').trim();
  const shortcut = matches?.[1].replace(/&&/, '').trim();

  return {
    label: cleanLabel,
    render: () => {
      if (shortcut) {
        return createElement(Fragment, {}, [
          createElement('mnemonic', {}, shortcut),
          cleanLabel.replace(shortcut, ''),
        ]);
      }

      return cleanLabel;
    },
  };
};

export { renderTitle };
