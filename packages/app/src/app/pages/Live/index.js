import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import Padding from '@codesandbox/common/lib/components/spacing/Padding';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { inject, observer } from 'app/componentConnectors';
import { Skeleton } from 'app/components/Skeleton';
import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { Navigation } from 'app/pages/common/Navigation';
import { SignInButton } from 'app/pages/common/SignInButton';
import { QuickActions } from 'app/pages/Sandbox/QuickActions';
import { hasAuthToken } from 'app/utils/user';
import * as React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import Editor from '../Sandbox/Editor';
import { BlinkingDot } from './BlinkingDot';

class LivePage extends React.Component {
  loggedIn = this.props.store.hasLogIn;

  UNSAFE_componentWillMount() {
    this.initializeLive();
  }

  disconnectLive() {
    if (this.props.store.live.isLive) {
      this.props.signals.live.onNavigateAway({});
    }
  }

  componentWillUnmount() {
    this.disconnectLive();
    this.props.signals.editor.onNavigateAway({});
  }

  initializeLive = () => {
    if (hasAuthToken()) {
      this.loggedIn = true;
      this.props.signals.live.roomJoined({
        roomId: this.props.match.params.id,
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.id !== this.props.match.params.id ||
      (hasAuthToken() && !this.loggedIn)
    ) {
      this.disconnectLive();
      this.initializeLive();
    }
  }

  getContent = () => {
    const { store } = this.props;

    if (!hasAuthToken()) {
      return (
        <>
          <div
            style={{
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '1rem',
              fontSize: '1.5rem',
            }}
          >
            Sign in required
          </div>
          <Title style={{ fontSize: '1.25rem' }}>
            You need to sign in to join this session
          </Title>
          <br />
          <div>
            <SignInButton />
          </div>
        </>
      );
    }

    if (store.live.error) {
      if (store.live.error === 'room not found') {
        return (
          <>
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
            <Title style={{ fontSize: '1.25rem' }}>
              It seems like this session doesn
              {"'"}t exist or has been closed
            </Title>
            <br />
            <Link to="/s">Create Sandbox</Link>
          </>
        );
      }

      return (
        <>
          <Title>An error occured while connecting to the live session:</Title>
          <SubTitle>{store.live.error}</SubTitle>
          <br />
          <br />
          <Link to="/s">Create Sandbox</Link>
        </>
      );
    }

    if (!store.editor.currentSandbox) {
      return (
        <>
          <Skeleton
            titles={[
              {
                content: <BlinkingDot />,
                delay: 0,
              },
              {
                content: 'Joining Live Session...',
                delay: 0.5,
              },
            ]}
          />
        </>
      );
    }

    return null;
  };

  render() {
    const { match, store } = this.props;

    // eslint-disable-next-line
    store.user; // Force observer call

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
            <Navigation title="Live Session" />
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

    return (
      <>
        {sandbox && (
          <Helmet>
            <title>{getSandboxName(sandbox)} - CodeSandbox</title>
          </Helmet>
        )}
        <Editor match={match} />
        <QuickActions />
      </>
    );
  }
}

// eslint-disable-next-line import/no-default-export
export default inject('signals', 'store')(observer(LivePage));
