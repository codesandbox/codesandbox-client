import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import React, { ComponentProps, FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Description } from '../../elements';

import { FilesContainer } from './elements';
import { ExistingConfigurations } from './ExistingConfigurations';
import { OtherConfigurations } from './OtherConfigurations';

type CreatedPaths = ComponentProps<typeof ExistingConfigurations>['paths'];
type RestPaths = ComponentProps<typeof OtherConfigurations>['paths'];
export const ConfigurationFiles: FunctionComponent = () => {
  const {
    state: {
      editor: { currentSandbox: sandbox },
    },
  } = useOvermind();
  const { configurationFiles } = getTemplateDefinition(sandbox.template);

  const createdPaths: CreatedPaths = {};
  const restPaths: RestPaths = {};

  Object.entries(configurationFiles)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .forEach(([key, config]) => {
      try {
        const module = resolveModule(key, sandbox.modules, sandbox.directories);
        createdPaths[key] = { config, module };
      } catch {
        restPaths[key] = { config };
      }
    });

  return (
    <div>
      <Description>
        CodeSandbox supports several config files per template, you can see and
        edit all supported files for the current sandbox here.
      </Description>

      <FilesContainer>
        <ExistingConfigurations paths={createdPaths} />

        <OtherConfigurations paths={restPaths} />
      </FilesContainer>
    </div>
  );
};
