import React from 'react';
import history from 'app/utils/history';
import { Button } from '@codesandbox/common/lib/components/Button';
import { gitHubToSandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

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
      // @ts-ignore
      window.stackbitWindow.close();

      history.push(gitHubToSandboxUrl(data.project.repository.url));
    }
  }
}

function openStackbit(username: string) {
  // @ts-ignore
  window.stackbitWindow = window.open(
    `https://app.stackbit.com/wizard?ref=codesandbox&githubUser=${username}&ssgExclusive=1&ssg=gatsby&cmsExclusive=netlifycms,forestry,nocms`,
    '_blank',
    'width=1210,height=800'
  );
}

interface Props {
  username: string;
  style?: React.CSSProperties;
}

export const StackbitButton = ({ username, style }: Props) => (
  <Button style={style} small onClick={() => openStackbit(username)}>
    Generate Sandbox
  </Button>
);
