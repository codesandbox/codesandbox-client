import React from 'react';
import { observer, inject } from 'mobx-react';

const VSCodePlaceholder = ({ children, store, hideTitle }) => {
  if (store.preferences.settings.experimentVSCode) {
    return hideTitle ? null : (
      <div
        style={{
          fontSize: '.875rem',
          fontStyle: 'italic',
          color: 'rgba(255, 255, 255, 0.5)',
          lineHeight: 1.4,
          fontWeight: 500,
          marginBottom: '1.5rem',
        }}
      >
        Some options are disabled because they are handled by VSCode. You can
        open the settings of VSCode by pressing {"'"}CTRL/CMD + ,{"'"}.
      </div>
    );
  }

  return children;
};

export default inject('store', 'signals')(observer(VSCodePlaceholder));
