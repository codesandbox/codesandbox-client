import React from 'react';
import Column from '../../../components/flex/Column';

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
      <Column alignItems="inherit" style={{ marginTop: '2rem' }}>
        <div style={{ flex: 2 }}><ShowcasePreview /></div>
        <div style={{ flex: 1 }}><SandboxInfo title={title} /></div>
      </Column>
    );
  }
}
