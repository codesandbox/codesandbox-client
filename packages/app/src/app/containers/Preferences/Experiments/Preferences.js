import React from 'react';
import { inject, observer } from 'mobx-react';

import { Container, PreferenceContainer, Description } from '../styles';

export default inject('store', 'signals')(
  observer(({ store, signals }) => (
    // const bindValue = name => ({
    //   value: store.editor.preferences.settings.experiments[name],
    //   setValue: value =>
    //     signals.editor.preferences.preferenceChanged({
    //       name: `experiments.${name}`,
    //       value,
    //     }),
    // });
    <Container>
      <PreferenceContainer>
        <Description>
          We have no experiments running currently! Tune in later to find some
          new goodies to test.
        </Description>
      </PreferenceContainer>
    </Container>
  ))
);
