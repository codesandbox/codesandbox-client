import React from 'react';
import { inject, observer } from 'mobx-react';

import { Title, SubContainer, SubDescription } from '../elements';

function Experiments() {
  // const bindValue = name => ({
  //   value: store.preferences.settings[name],
  //   setValue: value =>
  //     signals.preferences.settingChanged({
  //       name,
  //       value,
  //     }),
  // });

  return (
    <div>
      <Title>Experiments</Title>

      <SubContainer>
        <SubDescription>
          There are no experiments running at the moment. Stay tuned for new
          experiments!
        </SubDescription>
      </SubContainer>
    </div>
  );
}

export default inject('store', 'signals')(observer(Experiments));
