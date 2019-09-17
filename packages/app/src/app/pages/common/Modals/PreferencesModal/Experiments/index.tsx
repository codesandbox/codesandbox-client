import React from 'react';

import {
  Title,
  SubContainer,
  SubDescription,
  PreferenceContainer,
} from '../elements';

// const windowWithOvermind: {
//   useOvermind?: (val?: boolean) => 'true' | null;
// } = window as any;

export function Experiments() {
  // const bindValue = name => ({
  //   value: store.preferences.settings[name],
  //   setValue: value =>
  //     signals.preferences.settingChanged({
  //       name,
  //       value,
  //     }),
  // });

  // const [usingOvermind, setUsingOvermind] = React.useState(
  //   typeof windowWithOvermind.useOvermind !== 'undefined' &&
  //     windowWithOvermind.useOvermind() === 'true'
  // );

  return (
    <div>
      <Title>Experiments</Title>

      <SubContainer>
        <PreferenceContainer>
          <SubDescription>
            There are no experiments running at the moment. Stay tuned for new
            experiments!
          </SubDescription>
          {/*
          <PaddedPreference
            title="Use Overmind"
            type="boolean"
            value={usingOvermind}
            setValue={val => {
              windowWithOvermind.useOvermind(val);
              setUsingOvermind(val);
              track('Overmind Enabled', {
                enabled: val,
              });
            }}
          />
          <SubDescription>
            Use Overmind (an evolution of our current state management) as the
            state management
          </SubDescription>
            */}
        </PreferenceContainer>
      </SubContainer>
    </div>
  );
}

// export default inject('store', 'signals')(observer(Experiments));
