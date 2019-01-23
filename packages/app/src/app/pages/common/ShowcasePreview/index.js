import React from 'react';

import Preview from 'app/components/Preview';
import { parseConfigurations } from 'app/store/utils/parse-configurations';
import { mainModule } from 'app/store/utils/main-module';

import { Container } from './elements';

const ShowcasePreview = ({ settings, sandbox }) => {
  const parsedConfigs = parseConfigurations(sandbox);
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
