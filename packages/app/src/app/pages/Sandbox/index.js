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

import Editor from './Editor';

class SandboxPage extends React.Component {
  componentWillMount() {
    if (
      window.screen.availWidth < 800 &&
      !document.location.search.includes('from-embed')
    ) {
      const addedSign = document.location.search ? '&' : '?';
      document.location.href =
        document.location.href.replace('/s/', '/embed/') +
        addedSign +
        'codemirror=1';
    } else {
      this.fetchSandbox();
    }
  }

  fetchSandbox = () => {
    this.props.signals.editor.sandboxChanged({
      id: this.props.match.params.id,
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchSandbox();
    }
  }

  render() {
    const { match, store } = this.props;

    if (store.editor.isLoading) {
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

    if (store.editor.notFound) {
      return (
        <Centered horizontal vertical>
          <Title>
            We could not find the Sandbox you{"'"}re looking for...
            <br />
            <br />
            <Link to="/s">Create Sandbox</Link>
          </Title>
        </Centered>
      );
    }

    if (store.editor.error) {
      return (
        <Centered horizontal vertical>
          <Title>An error occured when fetching the sandbox:</Title>
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
  DragDropContext(HTML5Backend)(observer(SandboxPage))
);
