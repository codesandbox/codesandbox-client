import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import QuickActions from 'app/pages/Sandbox/QuickActions';

import Navigation from 'app/pages/common/Navigation';
import Title from 'app/components/Title';
import Centered from 'common/components/flex/Centered';
import Fullscreen from 'common/components/flex/Fullscreen';
import Padding from 'common/components/spacing/Padding';
import Skeleton from 'app/components/Skeleton';

import Editor from './Editor';
import HTML5Backend from '../common/HTML5BackendWithFolderSupport';

class SandboxPage extends React.Component {
  componentWillMount() {
    if (window.screen.availWidth < 800) {
      if (!document.location.search.includes('from-embed')) {
        const addedSign = document.location.search ? '&' : '?';
        document.location.href =
          document.location.href.replace('/s/', '/embed/') +
          addedSign +
          'codemirror=1';
      } else {
        this.props.signals.preferences.codeMirrorForced();
      }
    }

    this.fetchSandbox();
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

  getContent() {
    const { store } = this.props;

    if (store.editor.isLoading) {
      return (
        <React.Fragment>
          <Skeleton
            titles={[
              {
                content: 'Loading Sandbox',
                delay: 0.6,
              },
              {
                content: 'Fetching git repository...',
                delay: 2,
              },
            ]}
          />
        </React.Fragment>
      );
    }

    if (store.editor.notFound) {
      return (
        <React.Fragment>
          <div
            style={{
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '1rem',
              fontSize: '1.5rem',
            }}
          >
            404 Not Found
          </div>
          <Title style={{ fontSize: '1.25rem' }}>
            We could not find the sandbox you{"'"}re looking for
          </Title>
          <br />
          <Link to="/s">Create Sandbox</Link>
        </React.Fragment>
      );
    }

    if (store.editor.error) {
      return (
        <React.Fragment>
          <div
            style={{
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '1rem',
              fontSize: '1.5rem',
            }}
          >
            Something went wrong
          </div>
          <Title style={{ fontSize: '1.25rem' }}>{store.editor.error}</Title>
          <br />
          <Link to="/s">Create Sandbox</Link>
        </React.Fragment>
      );
    }

    return null;
  }

  render() {
    const { match, store } = this.props;

    const content = this.getContent();

    if (content) {
      return (
        <Fullscreen>
          <Padding
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100vw',
              height: '100vh',
            }}
            margin={1}
          >
            <Navigation title="Sandbox Editor" />
            <Centered
              style={{ flex: 1, width: '100%', height: '100%' }}
              horizontal
              vertical
            >
              {content}
            </Centered>
          </Padding>
        </Fullscreen>
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
