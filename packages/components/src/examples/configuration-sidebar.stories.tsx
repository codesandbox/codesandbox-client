import React from 'react';
import { Element, Collapsible, Text, Button, Stack, SidebarRow } from '..';

export default {
  title: 'examples/SidebarConfig',
};

const NetlifyIcon = props => (
  <svg width={12} height={12} fill="none" viewBox="0 0 12 12" {...props}>
    <path
      fill="#4CAA9F"
      d="M.474 7.144a1.619 1.619 0 010-2.288L4.856.474a1.619 1.619 0 012.288 0l4.382 4.382a1.619 1.619 0 010 2.288l-4.382 4.382a1.619 1.619 0 01-2.288 0L.474 7.144z"
    />
  </svg>
);

const PrettierIcon = props => (
  <svg width={10} height={11} fill="none" viewBox="0 0 10 11" {...props}>
    <path
      fill="#56B3B4"
      d="M8.486 2.057H7.97a.257.257 0 100 .514h.515a.257.257 0 100-.514z"
    />
    <path
      fill="#EA5E5E"
      d="M2.829 10.286H.257a.257.257 0 000 .514H2.83a.257.257 0 100-.514z"
    />
    <path
      fill="#BF85BF"
      d="M7.971 6.171H6.43a.257.257 0 100 .515H7.97a.257.257 0 000-.515z"
    />
    <path
      fill="#EA5E5E"
      d="M5.4 6.171H3.343a.257.257 0 100 .515H5.4a.257.257 0 100-.515z"
    />
    <path
      fill="#56B3B4"
      d="M2.314 6.171H.257a.257.257 0 100 .515h2.057a.257.257 0 100-.515z"
    />
    <path
      fill="#BF85BF"
      d="M2.829 8.229H.257a.257.257 0 100 .514H2.83a.257.257 0 100-.514zM2.829 4.114H.257a.257.257 0 100 .515H2.83a.257.257 0 100-.515z"
    />
    <path
      fill="#F7BA3E"
      d="M7.971 1.028H2.828a.257.257 0 000 .515h5.143a.257.257 0 000-.515z"
    />
    <path
      fill="#EA5E5E"
      d="M1.8 1.028H.257a.257.257 0 000 .515H1.8a.257.257 0 000-.515z"
    />
    <path
      fill="#F7BA3E"
      d="M2.829 9.257h-.515a.257.257 0 000 .515h.515a.257.257 0 100-.515z"
    />
    <path
      fill="#56B3B4"
      d="M2.829 3.086h-.515a.257.257 0 100 .514h.515a.257.257 0 100-.514zM1.286 9.257H.257a.257.257 0 000 .515h1.029a.257.257 0 100-.515z"
    />
    <path
      fill="#F7BA3E"
      d="M1.286 3.086H.257a.257.257 0 100 .514h1.029a.257.257 0 100-.514z"
    />
    <path
      fill="#56B3B4"
      d="M8.486 5.143H4.37a.257.257 0 100 .514h4.115a.257.257 0 100-.514z"
    />
    <path
      fill="#F7BA3E"
      d="M3.343 5.143H1.8a.257.257 0 100 .514h1.543a.257.257 0 100-.514z"
    />
    <path
      fill="#EA5E5E"
      d="M.771 5.143H.257a.257.257 0 100 .514h.514a.257.257 0 100-.514z"
    />
    <path
      fill="#BF85BF"
      d="M6.943 2.057H4.886a.257.257 0 100 .514h2.057a.257.257 0 100-.514z"
    />
    <path
      fill="#56B3B4"
      d="M3.857 2.057h-3.6a.257.257 0 000 .514h3.6a.257.257 0 100-.514z"
    />
    <path
      fill="#BF85BF"
      d="M.771 7.2H.257a.257.257 0 100 .514h.514a.257.257 0 000-.514z"
    />
    <path
      fill="#EA5E5E"
      d="M9 3.086H6.429a.257.257 0 100 .514H9a.257.257 0 100-.514z"
    />
    <path
      fill="#F7BA3E"
      d="M9 4.114H6.429a.257.257 0 100 .515H9a.257.257 0 100-.515z"
    />
    <path
      fill="#56B3B4"
      d="M6.429 0H.257a.257.257 0 000 .514H6.43a.257.257 0 100-.514z"
    />
  </svg>
);

const NPMIcon = props => (
  <svg width={17} height={16} fill="none" viewBox="0 0 17 16" {...props}>
    <path
      fill="#FF453A"
      d="M.667 16V0h16.172v16H.668zM3.708 2.998v9.98h5.097V5.079h2.97v7.9h2.022V3H3.708z"
    />
  </svg>
);

const VercelIcon = props => (
  <svg width={12} height={10} fill="none" viewBox="0 0 12 10" {...props}>
    <path fill="#fff" d="M6 0l6 10H0L6 0z" />
  </svg>
);

export const Basic = () => (
  <Element
    as="aside"
    css={{
      width: '200px',
      height: '100vh',
      borderRight: '1px solid',
      borderColor: 'sideBar.border',
    }}
  >
    <Collapsible title="Configuration Files" defaultOpen>
      <Stack direction="vertical" gap={6}>
        <Element css={{ paddingX: 2 }}>
          <SidebarRow>Configuration your Sandbox</SidebarRow>
          <Text variant="muted">
            CodeSandbox supports several config files per template, you can see
            and edit all supported files for the current sandbox here.
          </Text>
        </Element>
        <Stack direction="vertical" gap={4} css={{ paddingX: 2 }}>
          <Element>
            <Stack gap={2} marginBottom={2}>
              <NPMIcon />
              <Text size={2}>package.json</Text>
            </Stack>
            <Stack gap={4} align="flex-end" justify="space-between">
              <Text size={2} variant="muted">
                Describes the overall configuration of your project.
              </Text>
              <Button style={{ width: 100 }} variant="secondary">
                Edit
              </Button>
            </Stack>
          </Element>
          <Element>
            <Stack gap={2} marginBottom={2}>
              <NPMIcon />
              <Text size={2}>sandbox.config.json</Text>
            </Stack>
            <Stack gap={4} align="flex-end" justify="space-between">
              <Text size={2} variant="muted">
                Describes the overall configuration of your project.
              </Text>
              <Button style={{ width: 100 }} variant="secondary">
                Edit
              </Button>
            </Stack>
          </Element>
        </Stack>
      </Stack>
    </Collapsible>
    <Collapsible title="Other Configuration">
      <Stack direction="vertical" gap={4} css={{ paddingX: 2 }}>
        <Element>
          <Stack gap={2} marginBottom={2}>
            <PrettierIcon />
            <Text size={2}>.prettierc</Text>
          </Stack>
          <Stack gap={4} align="flex-end" justify="space-between">
            <Text size={2} variant="muted">
              Defines how all files will be prettified by Prettier
            </Text>
            <Button style={{ width: 100 }} variant="secondary">
              Edit
            </Button>
          </Stack>
        </Element>
        <Element>
          <Stack gap={2} marginBottom={2}>
            <NetlifyIcon />
            <Text size={2}>netlify.toml</Text>
          </Stack>
          <Stack gap={4} align="flex-end" justify="space-between">
            <Text size={2} variant="muted">
              Configuration for your deployments on netlify
            </Text>
            <Button style={{ width: 100 }} variant="secondary">
              Edit
            </Button>
          </Stack>
        </Element>
        <Element>
          <Stack gap={2} marginBottom={2}>
            <VercelIcon />
            <Text size={2}>vercel.json</Text>
          </Stack>
          <Stack gap={4} align="flex-end" justify="space-between">
            <Text size={2} variant="muted">
              Configuration for your deployments on now
            </Text>
            <Button style={{ width: 100 }} variant="secondary">
              Edit
            </Button>
          </Stack>
        </Element>
      </Stack>
    </Collapsible>
  </Element>
);
