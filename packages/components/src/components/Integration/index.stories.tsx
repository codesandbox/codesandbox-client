import React from 'react';
import { action } from '@storybook/addon-actions';

import { Integration } from '.';
import { Text } from '../Text';
import { Stack } from '../Stack';
import { Button } from '../Button';
import { Element } from '../Element';

export default {
  title: 'components/Integration',
  component: Integration,
};

const GitHubIcon = props => (
  <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="#fff"
      d="M14.927 4.084A8.068 8.068 0 0012.015 1.1 7.678 7.678 0 008 0a7.68 7.68 0 00-4.016 1.1 8.067 8.067 0 00-2.911 2.984A8.177 8.177 0 000 8.2c0 1.787.509 3.394 1.526 4.821 1.017 1.428 2.332 2.415 3.943 2.963.187.036.326.01.416-.074a.422.422 0 00.136-.32l-.006-.577a97.58 97.58 0 01-.005-.95l-.24.042c-.152.029-.345.041-.578.038a4.313 4.313 0 01-.724-.075 1.598 1.598 0 01-.697-.32 1.354 1.354 0 01-.459-.657l-.104-.246a2.68 2.68 0 00-.328-.544c-.15-.2-.3-.335-.453-.406l-.073-.053a.776.776 0 01-.135-.129.588.588 0 01-.094-.149c-.02-.05-.004-.09.052-.123.056-.032.156-.048.302-.048l.208.032c.14.029.311.114.516.256.205.143.373.328.505.555.16.292.352.515.578.668.226.153.453.23.682.23.23 0 .428-.018.594-.054.167-.035.323-.089.469-.16.062-.477.233-.844.51-1.1a6.969 6.969 0 01-1.067-.192 4.194 4.194 0 01-.98-.417 2.821 2.821 0 01-.838-.715c-.222-.285-.405-.659-.547-1.121-.142-.463-.213-.997-.213-1.602 0-.861.274-1.595.823-2.2-.257-.647-.233-1.373.073-2.178.2-.064.5-.016.895.144.396.16.686.298.87.411.184.114.332.21.443.289a7.227 7.227 0 012-.278c.687 0 1.354.093 2 .278l.396-.256c.27-.171.59-.328.958-.47.368-.143.65-.182.844-.118.312.805.34 1.53.083 2.178.549.606.823 1.339.823 2.2 0 .605-.071 1.14-.213 1.607-.143.466-.326.84-.552 1.121a2.927 2.927 0 01-.844.71c-.337.192-.663.331-.98.417-.315.085-.671.15-1.067.192.361.32.542.826.542 1.516v2.253a.43.43 0 00.13.32c.087.086.224.11.411.075 1.611-.548 2.926-1.536 3.943-2.963S16 9.987 16 8.2c0-1.487-.358-2.86-1.073-4.116z"
    />
  </svg>
);
const NetlifyIcon = props => (
  <svg width={11} height={11} fill="none" viewBox="0 0 11 11" {...props}>
    <path
      fill="#4CAA9F"
      d="M4.536.293a1 1 0 011.414 0l4.242 4.243a1 1 0 010 1.414L5.95 10.192a1 1 0 01-1.414 0L.293 5.95a1 1 0 010-1.414L4.536.293z"
    />
  </svg>
);

const VercelIcon = props => (
  <svg width={12} height={10} fill="none" viewBox="0 0 12 10" {...props}>
    <path fill="#fff" d="M6 0l6 10H0L6 0z" />
  </svg>
);

export const IntegrationVercel = () => (
  <div style={{ width: 184 }}>
    <Integration icon={VercelIcon} title="Vercel">
      <Element marginX={2}>
        <Stack direction="vertical">
          <Text variant="muted">Enables</Text>
          <Text>Deployments</Text>
        </Stack>
        <Button onClick={action('Vercel Integration')}>Sign In</Button>
      </Element>
    </Integration>
  </div>
);

export const IntegrationNetlify = () => (
  <div style={{ width: 184 }}>
    <Integration icon={NetlifyIcon} title="netlify">
      <Element marginX={2}>
        <Stack direction="vertical">
          <Text variant="muted">Enables</Text>
          <Text>Deployments</Text>
        </Stack>
        <Button onClick={action('Netlify Integration')}>Deploy</Button>
      </Element>
    </Integration>
  </div>
);

export const IntegrationGitHub = () => (
  <div style={{ width: 184 }}>
    <Integration icon={GitHubIcon} title="GitHub">
      <Element marginX={2}>
        <Stack direction="vertical">
          <Text variant="muted">Enables</Text>
          <Text>Commits & PRs</Text>
        </Stack>
        <Button onClick={action('GitHub Integration')}>Sign In</Button>
      </Element>
    </Integration>
  </div>
);
