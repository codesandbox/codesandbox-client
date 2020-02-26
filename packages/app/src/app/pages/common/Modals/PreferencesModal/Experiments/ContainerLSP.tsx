import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { SubDescription, PaddedPreference } from '../elements';

export const ContainerLSP: FunctionComponent = () => {
  const {
    actions: {
      preferences: { toggleContainerLspExperiment },
    },
    state: { user },
  } = useOvermind();

  return user ? (
    <>
      <PaddedPreference
        setValue={() => toggleContainerLspExperiment()}
        title="Use container language server"
        tooltip="Language server"
        type="boolean"
        value={user.experiments.containerLsp}
      />

      <SubDescription>
        As part of making containers more powerful we now allow the language
        server to run there. Please help us test it :-)
      </SubDescription>
    </>
  ) : null;
};
