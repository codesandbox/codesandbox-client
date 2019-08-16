import React from 'react';

import Preview from '@codesandbox/common/lib/components/Preview';
import { parseSandboxConfigurations } from '@codesandbox/common/lib/templates/configuration/parse-sandbox-configurations';
import { mainModule } from 'app/store/utils/main-module';

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
