import { createElement } from 'react';

const REGEX_ELEMENT = /&&/;
const REGEX_ELEMENT_SHORTCUT = /(&&\w)/g;

const clean = (payload: string) => payload.replace(REGEX_ELEMENT, '').trim();

const renderTitle = (label: string) => {
  const cleanLabel = clean(label);
  const labelSplit = label.split(REGEX_ELEMENT_SHORTCUT);

  return {
    label: cleanLabel,
    render: () => {
      if (labelSplit) {
        return labelSplit.map(element => {
          if (/(&&\w)/g.test(element)) {
            return createElement('mnemonic', null, clean(element));
          }

          return element;
        });
      }

      return cleanLabel;
    },
  };
};

export { renderTitle };
