import React from 'react';

import { SubTitle } from 'app/components/SubTitle';
import { DevToolProps } from '..';
import { Container } from './elements';

type Props = { viewId: string };
type State = {};

class ViewNotFound extends React.PureComponent<DevToolProps & Props, State> {
  render() {
    const { viewId } = this.props;
    return (
      <Container>
        <SubTitle>View {`"${viewId}"`} not found.</SubTitle>
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
