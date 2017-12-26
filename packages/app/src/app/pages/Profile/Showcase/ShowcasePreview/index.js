import React from 'react';

import Preview from 'app/components/Preview';
import { findMainModule } from 'common/sandbox/modules';

import { Container } from './elements';

class ShowcasePreview extends React.PureComponent {
  render() {
    const sandbox = this.props.sandbox;
    const mainModule = findMainModule(
      sandbox.modules,
      sandbox.directories,
      sandbox.entry
    );

    return (
      <Container>
        <Preview
          sandbox={sandbox}
          currentModule={mainModule}
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
