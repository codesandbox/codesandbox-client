import React from 'react';

import Preview from 'app/components/Preview';
import { mainModule } from 'app/store/utils/main-module';

import { Container } from './elements';

class ShowcasePreview extends React.PureComponent {
  render() {
    const sandbox = this.props.sandbox;
    const module = mainModule(sandbox, sandbox.parsedConfigurations);

    return (
      <Container>
        <Preview
          sandbox={sandbox}
          currentModule={module}
          settings={this.props.settings}
          template={sandbox.template}
          isInProjectView
          noDelay
        />
      </Container>
    );
  }
}

export default ShowcasePreview;
