import Preview from '@codesandbox/common/es/components/Preview';
import { parseSandboxConfigurations } from '@codesandbox/common/es/templates/configuration/parse-sandbox-configurations';
import { mainModule } from 'app/overmind/utils/main-module';
import React from 'react';

import { Container } from './elements';

const ShowcasePreview = ({ settings, sandbox }) => {
  const parsedConfigs = parseSandboxConfigurations(sandbox);
  const module = mainModule(sandbox, parsedConfigs);

  return (
    <Container>
      <Preview
        sandbox={sandbox}
        currentModule={module}
        settings={settings}
        template={sandbox.template}
        isInProjectView
        noDelay
      />
    </Container>
  );
};

export default ShowcasePreview;
