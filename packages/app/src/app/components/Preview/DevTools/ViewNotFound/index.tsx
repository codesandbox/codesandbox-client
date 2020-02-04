import React from 'react';

import { DevToolProps } from '..';
import { Container } from './elements';

type Props = { viewId: string };
type State = {};

class ViewNotFound extends React.PureComponent<DevToolProps & Props, State> {
  render() {
    const { viewId } = this.props;
    return (
      <Container>
        <div>View &quote;{viewId}&quote; not found.</div>
      </Container>
    );
  }
}

export const viewNotFound = viewId => ({
  id: 'codesandbox.view-not-found',
  title: `Unknown View "${viewId}"`,
  Content: (props: DevToolProps) => <ViewNotFound {...props} viewId={viewId} />,
  actions: [],
});
