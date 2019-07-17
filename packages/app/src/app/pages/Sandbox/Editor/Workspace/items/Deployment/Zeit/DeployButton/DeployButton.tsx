import { observer } from 'mobx-react-lite';
import React from 'react';

import { DeploymentIntegration } from 'app/components/DeploymentIntegration';
import NowLogo from 'app/components/NowLogo';
import { useSignals, useStore } from 'app/store';

import { DeployButtonContainer } from '../../elements';

import { Overlay, CreateFile } from './elements';

type Props = {
  isOpen: boolean;
  toggle: () => void;
};
export const DeployButton = observer<Props>(({ isOpen, toggle }) => {
  const {
    files,
    deployment: { deploySandboxClicked },
  } = useSignals();
  const { editor } = useStore();
  const nowFile = editor.currentSandbox.modules
    .toJSON()
    .filter(file => file.title === 'now.json');

  const createFile = () => {
    files.moduleCreated({
      title: 'now.json',
      code: JSON.stringify({
        version: 2,
      }),
    });
  };

  return (
    <DeployButtonContainer>
      <DeploymentIntegration
        color="#000000"
        deploy={deploySandboxClicked}
        Icon={NowLogo}
        name="Now"
        open={isOpen}
        toggle={toggle}
      >
        {!nowFile.length && (
          <Overlay>
            It seems you don{"'"}t have{' '}
            <a
              href="https://zeit.co/docs/v2/deployments/configuration"
              target="_blank"
              rel="noreferrer noopener"
            >
              now.json
            </a>{' '}
            file. Please create{' '}
            <CreateFile onClick={createFile}>one</CreateFile> to be able to
            deploy to{' '}
            <a
              href="https://zeit.co/now"
              target="_blank"
              rel="noreferrer noopener"
            >
              <span>ZEIT Now</span>
            </a>
            .
          </Overlay>
        )}
        Deploy your sandbox on{' '}
        <a href="https://zeit.co/now" rel="noreferrer noopener" target="_blank">
          <span>ZEIT Now</span>
        </a>
      </DeploymentIntegration>
    </DeployButtonContainer>
  );
});
