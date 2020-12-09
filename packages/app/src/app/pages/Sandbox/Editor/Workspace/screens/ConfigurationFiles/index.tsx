import React from 'react';
import {
  Element,
  Collapsible,
  Text,
  Button,
  Stack,
  Grid as BaseGrid,
} from '@codesandbox/components';
import css from '@styled-system/css';
import getDefinition from '@codesandbox/common/lib/templates';
import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';

import { useOvermind } from 'app/overmind';
import styled, { withTheme } from 'styled-components';
import { TypescriptIcon } from 'app/components/TypescriptIcon';
import {
  NetlifyIcon,
  PrettierIcon,
  NPMIcon,
  VercelIcon,
  JSIcon,
  CodeSandboxIcon,
} from './Icons';

const getIcon = name => {
  const icons = {
    'netlify.toml': NetlifyIcon,
    'package.json': NPMIcon,
    'vercel.json': VercelIcon,
    '.prettierrc': PrettierIcon,
    'jsconfig.json': JSIcon,
    'tsconfig.json': TypescriptIcon,
    'sandbox.config.json': CodeSandboxIcon,
  };

  return icons[name] || JSIcon;
};

const Grid = styled(BaseGrid)`
  grid-template-columns: 1fr 56px;
  grid-gap: ${({ theme }) => theme.space[4]}px;
  align-items: flex-end;
`;

export const ConfigurationFilesComponent = ({ theme }) => {
  const {
    state: {
      editor: { currentSandbox },
    },
    actions: { files, editor },
  } = useOvermind();

  const { configurationFiles } = getDefinition(currentSandbox.template);

  const createdPaths = {};
  const restPaths = {};

  Object.keys(configurationFiles)
    .sort()
    .forEach(p => {
      const config = configurationFiles[p];

      try {
        const module = resolveModule(
          p,
          currentSandbox.modules,
          currentSandbox.directories
        );
        createdPaths[p] = {
          config,
          module,
        };
      } catch (e) {
        restPaths[p] = {
          config,
        };
      }
    });

  return (
    <>
      <Collapsible title="Configuration Files" defaultOpen>
        <Stack direction="vertical" gap={6} padding={2}>
          <Element>
            <Text block marginBottom={2}>
              Configuration for your Sandbox
            </Text>
            <Text variant="muted">
              CodeSandbox supports several configuration files per template, you
              can see and edit all supported files for the current sandbox here.
            </Text>
          </Element>
          <Stack direction="vertical" gap={4}>
            {Object.keys(createdPaths).map(path => {
              const { config, module } = createdPaths[path];
              const Icon = getIcon(config.title);
              return (
                <Element key={config.title}>
                  <Stack gap={2} marginBottom={2}>
                    <Icon />
                    <Text size={2}>{config.title}</Text>
                  </Stack>
                  <Grid>
                    <Text size={2} variant="muted">
                      {config.description}
                    </Text>
                    <Button
                      css={css({
                        width: 'auto',
                        height: 4,
                      })}
                      variant="secondary"
                      onClick={() => editor.moduleSelected({ id: module.id })}
                    >
                      Edit
                    </Button>
                  </Grid>
                </Element>
              );
            })}
          </Stack>
        </Stack>
      </Collapsible>
      <Collapsible title="Other Configuration" defaultOpen>
        <Stack
          direction="vertical"
          gap={4}
          style={{ padding: `0 ${theme.space[3]}px` }}
        >
          {Object.keys(restPaths).map(path => {
            const { config } = restPaths[path];
            const Icon = getIcon(config.title);
            return (
              <Element key={config.title}>
                <Stack gap={2} marginBottom={2}>
                  <Icon />
                  <Text size={2}>{config.title}</Text>
                </Stack>
                <Grid>
                  <Text size={2} variant="muted">
                    {config.description}
                  </Text>
                  <Button
                    css={css({
                      width: 'auto',
                      height: 4,
                    })}
                    variant="secondary"
                    onClick={() =>
                      files.moduleCreated({
                        title: config.title,
                        directoryShortid: null,
                      })
                    }
                  >
                    Create
                  </Button>
                </Grid>
              </Element>
            );
          })}
        </Stack>
      </Collapsible>
    </>
  );
};

export const ConfigurationFiles = withTheme(ConfigurationFilesComponent);
