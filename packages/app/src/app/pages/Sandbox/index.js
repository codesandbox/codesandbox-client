import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import QuickActions from 'app/pages/Sandbox/QuickActions';

import Button from 'app/components/Button';
import NotFound from 'app/pages/common/NotFound';
import Navigation from 'app/pages/common/Navigation';
import Title from 'app/components/Title';
import Centered from 'common/components/flex/Centered';
import Fullscreen from 'common/components/flex/Fullscreen';
import Padding from 'common/components/spacing/Padding';
import Skeleton from 'app/components/Skeleton';
import GithubIntegration from 'app/src/app/pages/common/GithubIntegration';

import Editor from './Editor';

import { Wrong, Buttons, Private, PrivateWrapper } from './elements';

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

  disconnectLive() {
    if (this.props.store.live.isLive) {
      this.props.signals.live.onNavigateAway({});
    }
  }

  componentWillUnmount() {
    this.disconnectLive();
  }

  fetchSandbox = () => {
    const id = this.props.match.params.id;
    this.props.signals.editor.sandboxChanged({ id });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.disconnectLive();
      this.fetchSandbox();
    }
  }

  getContent() {
    const { store } = this.props;

    const { hasLogIn } = store;

    if (store.editor.notFound) {
      return <NotFound />;
    }

    if (store.editor.error) {
      const isGithub = this.props.match.params.id.indexOf('github') > -1;
      const hasPrivateAccess = store.user && store.user.integrations.github;
      return (
        <React.Fragment>
          <Wrong>Something went wrong</Wrong>
          <Title
            css={`
              font-size: 1.25rem;
              margin-bottom: 0px;
            `}
          >
            {store.editor.error}
          </Title>
          <br />
          <Buttons>
            <Button
              block
              small
              css={`
                margin: 0.5rem;
              `}
              href="/s"
            >
              Create Sandbox
            </Button>
            <Button
              block
              small
              css={`
                margin: 0.5rem;
              `}
              href="/"
            >
              {hasLogIn ? 'Dashboard' : 'Homepage'}
            </Button>
          </Buttons>
          {hasLogIn && isGithub && !hasPrivateAccess && (
            <PrivateWrapper>
              <Private>
                Did you try to open a private GitHub repository and are you a{' '}
                <Link to="/patron">patron</Link>? Then you might need to get
                private access:
              </Private>
              <GithubIntegration small />
            </PrivateWrapper>
          )}
        </React.Fragment>
      );
    }

    if (
      store.editor.isLoading ||
      (store.live.isTeam && store.live.isLoading) ||
      store.editor.currentSandbox == null
    ) {
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

    return null;
  }

  render() {
    const { match, store } = this.props;

    const content = this.getContent();

    if (content) {
      return (
        <Fullscreen>
          <Padding
            css={`
              display: flex;
              flex-direction: column;
              width: 100vw;
              height: 100vh;
            `}
            margin={1}
          >
            <Navigation title="Sandbox Editor" />
            <Centered
              css={`
                flex: 1;
                width: 100%;
                height: 100%;
              `}
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

export default inject('signals', 'store')(observer(SandboxPage));
