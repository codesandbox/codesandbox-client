import React from 'react';
import { inject, observer } from 'mobx-react';

import {
  Title,
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  SubDescription,
} from '../elements';

function Experiments({ store, signals }) {
  const bindValue = name => ({
    value: store.preferences.settings[name],
    setValue: value =>
      signals.preferences.settingChanged({
        name,
        value,
      }),
  });

  return (
    <div>
      <Title>Experiments</Title>

      <SubContainer>
        <PreferenceContainer>
          <PaddedPreference
            title="Use VSCode in the browser"
            type="boolean"
            {...bindValue('experimentVSCode')}
          />
          <SubDescription>
            Use the official VSCode editor directly in the browser.
          </SubDescription>
        </PreferenceContainer>
      </SubContainer>
    </div>
  );
}

export default inject('store', 'signals')(observer(Experiments));
