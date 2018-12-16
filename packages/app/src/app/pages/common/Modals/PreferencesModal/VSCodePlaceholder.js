import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';

const Title = styled.div`
  font-size: 0.875rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const VSCodePlaceholder = ({ children, store, hideTitle }) => {
  if (store.preferences.settings.experimentVSCode) {
    return hideTitle ? null : (
      <Title>
        Some options are disabled because they are handled by VSCode. You can
        open the settings of VSCode by pressing {"'"}CTRL/CMD + ,{"'"}.
      </Title>
    );
  }

  return children;
};

export default inject('store', 'signals')(observer(VSCodePlaceholder));
