import React from 'react';
import styled from 'styled-components';

import Preview from 'app/components/sandbox/Preview';
import delayEffect from '../../../utils/animation/delay-effect';

const Container = styled.div`
  ${delayEffect(0.40)}
  height: 500px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);
`;

export default class ShowcasePreview extends React.PureComponent {
  props: Props;

  render() {
    return (
      <Container>
        <Preview />
      </Container>
    );
  }
}
