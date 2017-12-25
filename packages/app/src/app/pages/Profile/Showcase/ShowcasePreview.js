import React from 'react';
import styled from 'styled-components';

import Preview from 'app/components/sandbox/Preview';
import delayEffect from 'common/utils/animation/delay-effect';
import { findMainModule } from 'app/store/entities/sandboxes/modules/selectors';

const Container = styled.div`
  position: relative;
  ${delayEffect(0.4)} height: 500px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);

  iframe {
    height: calc(100% - 3rem);
  }
`;

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
