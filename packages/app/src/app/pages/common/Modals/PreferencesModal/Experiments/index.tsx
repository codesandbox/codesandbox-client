import { useOvermind } from 'app/overmind';
import React from 'react';

import {
  PaddedPreference,
  PreferenceContainer,
  SubContainer,
  SubDescription,
  Title,
} from '../elements';

export const Experiments: React.FunctionComponent = () => {
  const { state, actions } = useOvermind();

  return (
    <div>
      <Title>Experiments</Title>
      <SubContainer>
        <PreferenceContainer>
          <PaddedPreference
            title="Use container language server"
            type="boolean"
            value={state.user.experiments.containerLsp}
            setValue={() => {
              actions.preferences.toggleContainerLspExperiment();
            }}
            tooltip="Language server"
          />
          <SubDescription>
            As part of making containers more powerful we now allow the language
            server to run there. Please help us test it :-)
          </SubDescription>
        </PreferenceContainer>
      </SubContainer>
    </div>
  );
};
