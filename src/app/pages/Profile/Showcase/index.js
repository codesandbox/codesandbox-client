import React from 'react';
import Row from '../../../components/flex/Row';

import SandboxInfo from './SandboxInfo';
import ShowcasePreview from './ShowcasePreview';

type Props = {
  title: string,
};

export default class Showcase extends React.PureComponent {
  props: Props;

  render() {
    const { title } = this.props;
    return (
      <Row alignItems="inherit" style={{ marginTop: '2rem' }}>
        <div style={{ flex: 1 }}><SandboxInfo title={title} /></div>
        <div style={{ flex: 2 }}><ShowcasePreview /></div>
      </Row>
    );
  }
}
