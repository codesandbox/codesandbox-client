import { CONTAINER_LSP } from '@codesandbox/common/lib/utils/feature-flags';
import React, { useState, useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { SubDescription, PaddedPreference } from '../elements';

export const ContainerLSP: React.FunctionComponent = () => {
  const { state } = useOvermind();
  const [containerLSP, setContainerLSP] = useState(false);
  useEffect(() => {
    if (CONTAINER_LSP === 'true') {
      return setContainerLSP(true);
    }
    return setContainerLSP(false);
  }, []);

  const setValue = (val: boolean) => {
    setContainerLSP(val);
    window.localStorage.setItem('CONTAINER_LSP', val.toString());
    location.reload();
  };

  return state.user ? (
    <>
      <PaddedPreference
        title="Use container language server"
        type="boolean"
        value={containerLSP}
        setValue={val => setValue(val)}
        tooltip="Language server"
      />
      <SubDescription>
        As part of making containers more powerful we now allow the language
        server to run there. Please help us test it :-)
      </SubDescription>
    </>
  ) : null;
};
