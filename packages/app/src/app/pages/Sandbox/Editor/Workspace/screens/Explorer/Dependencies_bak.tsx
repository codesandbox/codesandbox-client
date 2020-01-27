import React from 'react';
import { useOvermind } from 'app/overmind';
import {
  ThemeProvider,
  Element,
  Collapsible,
  List,
  ListAction,
  Text,
  Button,
  Select,
  Stack,
  FormField,
  Input,
  SidebarRow,
} from '@codesandbox/components';

export const Dependencies = props => {
  const {
    actions: {
      editor: { addNpmDependency, npmDependencyRemoved },
    },
    state: {
      editor: { parsedConfigurations },
    },
  } = useOvermind();

  if (!parsedConfigurations?.package) {
    return (
      <SidebarRow marginX={2}>
        <Text variant="danger">Unable to find package.json</Text>
      </SidebarRow>
    );
  }

  const { error, parsed } = parsedConfigurations.package;

  if (error) {
    return (
      <SidebarRow marginX={2}>
        <Text variant="danger">
          We weren{"'"}t able to parse the package.json
        </Text>
      </SidebarRow>
    );
  }

  const { dependencies = {} } = parsed;

  return (
    <List>
      {Object.keys(dependencies).map(name => (
        <Dependency key={name} name={name} version={dependencies[name]} />
      ))}
    </List>
  );
};

const Dependency = props => {
  return (
    <ListAction
      justify="space-between"
      css={{
        '.actions': { display: 'none' },
        ':hover': {
          '.actions': { display: 'flex' },
          '.version': { display: 'none' },
        },
      }}
    >
      <Text>{props.name}</Text>
      <span>
        <Stack align="center" className="actions">
          <Button variant="link" css={{ width: 5 }}>
            <svg
              width="15"
              height="13"
              viewBox="0 0 15 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.9722 9.82878C10.9615 11.0719 9.39726 11.8696 7.6416 11.8696C4.59364 11.8696 2.12279 9.46553 2.12279 6.5C2.12279 3.53447 4.59364 1.13043 7.6416 1.13043C10.2288 1.13043 12.4002 2.86259 12.9976 5.2H7.71964V6.5H14.4719V0L13.1266 0V2.78823C11.9196 1.10286 9.91295 0 7.6416 0C3.95197 0 0.960938 2.91015 0.960938 6.5C0.960938 10.0899 3.95197 13 7.6416 13C9.70515 13 11.5502 12.0897 12.7756 10.6593L11.9722 9.82878Z"
                fill="currentcolor"
              />
            </svg>
          </Button>
          <Button variant="link" css={{ width: 5 }} marginRight={2}>
            <svg
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 0.969703L9.09091 6.64682e-06L5 4.36364L0.909091 0L0 0.969696L4.09091 5.33333L0 9.69697L0.909091 10.6667L5 6.30303L9.09091 10.6667L10 9.69696L5.90909 5.33333L10 0.969703Z"
                fill="currentcolor"
              />
            </svg>
          </Button>
          <Select css={{ width: '80px' }}>
            <option>16.12.0</option>
            <option>16.11.0</option>
            <option>16.10.2</option>
            <option>16.12.1</option>
          </Select>
        </Stack>
        <Text variant="muted" className="version" marginRight={2}>
          {props.version}
        </Text>
      </span>
    </ListAction>
  );
};
