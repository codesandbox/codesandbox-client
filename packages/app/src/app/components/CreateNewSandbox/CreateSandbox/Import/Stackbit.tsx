import React from 'react';
import history from 'app/utils/history';
import { Button } from '@codesandbox/components';
import { gitHubToSandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

function openStackbit(username: string, closeModal: () => void) {
  const stackbitWindow = window.open(
    `https://app.stackbit.com/wizard?ref=codesandbox&githubUser=${username}`,
    '_blank',
    'width=1210,height=800'
  );

  window.addEventListener('message', receiveMessage, false);

  function receiveMessage(event) {
    if (event.origin === 'https://app.stackbit.com' && event.data) {
      const data = JSON.parse(event.data);

      if (
        data.type === 'project-update' &&
        data.project &&
        data.project.repository &&
        data.project.repository.url
      ) {
        stackbitWindow.close();

        closeModal();
        history.push(gitHubToSandboxUrl(data.project.repository.url));
        window.removeEventListener('message', receiveMessage, false);
      }
    }
  }
}

interface Props {
  username: string;
  closeModal: () => void;
  style?: React.CSSProperties;
}

export const StackbitButton = ({ username, style, closeModal }: Props) => (
  <Button
    style={style}
    autoWidth
    onClick={() => openStackbit(username, closeModal)}
  >
    Generate Sandbox
  </Button>
);
