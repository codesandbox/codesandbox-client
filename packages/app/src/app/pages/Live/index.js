import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import QuickActions from 'app/pages/Sandbox/QuickActions';

import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import Centered from 'common/components/flex/Centered';
import Skeleton from 'app/components/Skeleton';

import Editor from '../Sandbox/Editor';

class LivePage extends React.Component {
  componentWillMount() {
    this.initializeLive();
  }

  initializeLive = () => {
    this.props.signals.live.roomJoined({
      roomId: this.props.match.params.id,
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.initializeLive();
    }
  }

  render() {
    const { match, store } = this.props;

    if (store.live.isLoading) {
      return (
        <Centered horizontal vertical>
          <Skeleton
            titles={[
              {
                content: 'Loading sandbox...',
                delay: 0,
              },
              {
                content: 'Fetching git repository...',
                delay: 2,
              },
            ]}
          />
        </Centered>
      );
    }

    if (store.live.error) {
      return (
        <Centered style={{ height: '100vh' }} horizontal vertical>
          <Title>An error occured when connecting to the live session:</Title>
          <SubTitle>{store.editor.error}</SubTitle>
          <br />
          <br />
          <Link to="/s">Create Sandbox</Link>
        </Centered>
      );
    }

    const sandbox = store.editor.currentSandbox;

    if (sandbox) {
      document.title = `${sandbox.title || sandbox.id} - CodeSandbox`;
    }

    return (
      <React.Fragment>
        <Editor match={match} />
        <QuickActions />
      </React.Fragment>
    );
  }
}

export default inject('signals', 'store')(
  DragDropContext(HTML5Backend)(observer(LivePage))
);
