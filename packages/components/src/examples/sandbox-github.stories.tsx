import React from 'react';

import {
  Button,
  Collapsible,
  Element,
  Icon,
  Input,
  List,
  ListAction,
  Stack,
  Text,
  Textarea,
} from '..';
import { IntegrationGitHub } from '../components/Integration/integration.stories';

export default {
  title: 'examples/SandboxGithub',
};

const Sidebar = props => (
  <Element
    as="aside"
    css={{
      width: '200px',
      height: '100vh',
      borderRight: '1px solid',
      borderColor: 'sideBar.border',
      position: 'relative', // for absolute position delete button
    }}
    {...props}
  />
);

export const NotLoggedIn = () => (
  <Sidebar>
    <Collapsible title="Github" defaultOpen>
      <Element css={{ paddingX: 2 }}>
        <Text size={2} variant="muted" block marginBottom={4}>
          You can create commits and open pull request if you add GitHub to your
          intergrations.
        </Text>

        <IntegrationGitHub />
      </Element>
    </Collapsible>
  </Sidebar>
);

export const NotConnected = () => (
  <Sidebar>
    <Collapsible title="Github" defaultOpen>
      <Element css={{ paddingX: 2 }}>
        <Text size={3} weight="semibold" block marginBottom={4}>
          Export Sandbox to GitHub
        </Text>

        <Stack as="form" direction="vertical" gap={2}>
          <Input type="text" placeholder="Enter repository url" />

          <Button>Create Repository</Button>
        </Stack>
      </Element>
    </Collapsible>
  </Sidebar>
);

export const Connected = () => (
  <Sidebar>
    <Collapsible title="Github" defaultOpen>
      <Element css={{ paddingX: 2 }}>
        <Stack align="center" gap={2} marginBottom={6}>
          <Icon name="github" />

          <Text size={2}>codesandbox/components</Text>
        </Stack>

        <Element>
          <Text variant="muted">There are no changes</Text>
        </Element>
      </Element>
    </Collapsible>

    <Collapsible title="Export to GitHub" defaultOpen>
      <Element css={{ paddingX: 2 }}>
        <Stack as="form" direction="vertical" gap={2}>
          <Input type="text" placeholder="Enter repository url" />

          <Button variant="secondary">Create Repository</Button>
        </Stack>
      </Element>
    </Collapsible>
  </Sidebar>
);

export const Changes = () => (
  <Sidebar>
    <Collapsible title="Github" defaultOpen>
      <Element css={{ paddingX: 2 }}>
        <Stack gap={2} marginBottom={6}>
          <Icon name="github" />

          <Text size={2}>codesandbox/components</Text>
        </Stack>
      </Element>

      <Element>
        <Text size={3} block marginBottom={2} marginX={2}>
          Changes (4)
        </Text>

        <List marginBottom={6}>
          <ListAction gap={2}>
            <Icon color="#30D158" name="gitAdded" />

            <Text variant="muted">src/index.js</Text>
          </ListAction>

          <ListAction gap={2}>
            <Icon color="#FF453A" name="gitRemoved" />

            <Text variant="muted">src/style.css</Text>
          </ListAction>

          <ListAction gap={2}>
            <Icon color="#F69935" name="gitModified" />

            <Text variant="muted">package.json</Text>
          </ListAction>

          <ListAction gap={2}>
            <Icon color="#F69935" name="gitModified" />

            <Text variant="muted">dist.js</Text>
          </ListAction>
        </List>

        <Text size={3} block marginBottom={2} marginX={2}>
          Commit Message
        </Text>

        <Stack as="form" direction="vertical" gap={1} marginX={2}>
          <Input placeholder="Subject" />

          <Textarea maxLength={280} placeholder="Description" />

          <Button variant="secondary">Open Pull Request</Button>
        </Stack>
      </Element>
    </Collapsible>

    <Collapsible title="Export to GitHub" defaultOpen>
      <Element css={{ paddingX: 2 }}>
        <Stack as="form" direction="vertical" gap={2}>
          <Input type="text" placeholder="Enter repository url" />

          <Button variant="secondary">Create Repository</Button>
        </Stack>
      </Element>
    </Collapsible>
  </Sidebar>
);
