import React from 'react';
// import { inject, observer } from 'app/componentConnectors';

import {
  Title,
  SubContainer,
  SubDescription,
  PreferenceContainer,
  PaddedPreference,
} from '../elements';

const windowWithOvermind: {
  useOvermind?: (val?: boolean) => 'true' | null;
} = window as any;

export function Experiments() {
  // const bindValue = name => ({
  //   value: store.preferences.settings[name],
  //   setValue: value =>
  //     signals.preferences.settingChanged({
  //       name,
  //       value,
  //     }),
  // });

  const [usingOvermind, setUsingOvermind] = React.useState(
    typeof windowWithOvermind.useOvermind !== 'undefined' &&
      windowWithOvermind.useOvermind() === 'true'
  );

  return (
    <div>
      <Title>Experiments</Title>

      <SubContainer>
        <PreferenceContainer>
          <PaddedPreference
            title="Use Overmind"
            type="boolean"
            value={usingOvermind}
            setValue={val => {
              windowWithOvermind.useOvermind(val);
              setUsingOvermind(val);
            }}
          />
          <SubDescription>
            Use Overmind (an evolution of our current state management) as the
            state management
          </SubDescription>
        </PreferenceContainer>
      </SubContainer>
    </div>
  );
}

// export default inject('store', 'signals')(observer(Experiments));
