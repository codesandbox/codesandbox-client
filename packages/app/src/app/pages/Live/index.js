import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import Navigation from 'app/pages/common/Navigation';
import Fullscreen from 'common/components/flex/Fullscreen';

import QuickActions from 'app/pages/Sandbox/QuickActions';
import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import Centered from 'common/components/flex/Centered';
import Skeleton from 'app/components/Skeleton';
import Padding from 'common/components/spacing/Padding';
import SignInButton from 'app/pages/common/SignInButton';

import Editor from '../Sandbox/Editor';
import BlinkingDot from './BlinkingDot';

class LivePage extends React.Component {
  loggedIn = this.props.store.hasLogIn;

  componentWillMount() {
    this.initializeLive();
  }

  disconnectLive() {
    if (this.props.store.live.isLive) {
      this.props.signals.live.onNavigateAway({});
    }
  }

  componentWillUnmount() {
    this.disconnectLive();
  }

  initializeLive = () => {
    if (this.props.store.hasLogIn) {
      this.loggedIn = true;
      this.props.signals.live.roomJoined({
        roomId: this.props.match.params.id,
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.id !== this.props.match.params.id ||
      (this.props.store.hasLogIn && !this.loggedIn)
    ) {
      this.disconnectLive();
      this.initializeLive();
    }
  }

  getContent = () => {
    const { store } = this.props;

    if (!store.hasLogIn) {
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
            Sign in required
          </div>
          <Title
            css={`
              fontsize: 1.25rem;
            `}
          >
            You need to sign in to join this session
          </Title>
          <br />
          <div>
            <SignInButton />
          </div>
        </React.Fragment>
      );
    }

    if (store.live.error) {
      if (store.live.error === 'room not found') {
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
            <Title
              css={`
                fontsize: 1.25rem;
              `}
            >
              It seems like this session doesn{"'"}t exist or has been closed
            </Title>
            <br />
            <Link to="/s">Create Sandbox</Link>
          </React.Fragment>
        );
      }

      return (
        <React.Fragment>
          <Title>An error occured while connecting to the live session:</Title>
          <SubTitle>{store.live.error}</SubTitle>
          <br />
          <br />
          <Link to="/s">Create Sandbox</Link>
        </React.Fragment>
      );
    }

    if (store.live.isLoading || !store.editor.currentSandbox) {
      return (
        <React.Fragment>
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
        </React.Fragment>
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

export default inject('signals', 'store')(observer(LivePage));
