import * as React from 'react';

import { Spring } from 'react-spring/renderprops.cjs';

import Navigator from './Navigator';
import { Container, StyledFrame } from './elements';
import { dispatch } from 'codesandbox-api';

interface Props {
  sandboxId: string;
  defaultUrl: string;
  isResizing: boolean;
  title: string;

  onInitialized?: (el: HTMLIFrameElement) => void;

  showNavigation?: boolean;
  isInProjectView?: boolean;
  hide?: boolean;
  className?: string;
  screenshotUrl?: string;
  zenMode?: boolean;
  onToggleProjectView?: () => void;
  onOpenNewWindow?: () => void;
}

interface State {
  historyPosition: number;
  history: string[];
  urlInAddressBar: string;
}

export class BasePreview extends React.Component<Props, State> {
  el: HTMLIFrameElement;

  initializeFrame = () => {
    this.props.onInitialized(this.el);
  };

  updateUrl = (url: string) => {
    this.setState({ urlInAddressBar: url });
  };

  sendUrl = () => {
    const { urlInAddressBar } = this.state;

    if (this.el) {
      this.el.src = urlInAddressBar;

      this.setState({
        history: [urlInAddressBar],
        historyPosition: 0,
        urlInAddressBar,
      });
    }
  };

  handleRefresh = () => {
    const { defaultUrl } = this.props;
    const { history, historyPosition, urlInAddressBar } = this.state;
    const url = history[historyPosition] || urlInAddressBar;

    if (this.el) {
      this.el.src = url || defaultUrl;
    }

    this.setState({
      history: [url],
      historyPosition: 0,
      urlInAddressBar: url,
    });
  };

  handleBack = () => {
    dispatch({
      type: 'urlback',
    });
  };

  handleForward = () => {
    dispatch({
      type: 'urlforward',
    });
  };

  openNewWindow = () => {
    if (this.props.onOpenNewWindow) {
      this.props.onOpenNewWindow();
    }

    window.open(this.state.urlInAddressBar, '_blank');
  };

  render() {
    const {
      showNavigation,
      isInProjectView,
      hide,
      className,
      defaultUrl,
      screenshotUrl,
      onToggleProjectView,
      zenMode,
      title,
    } = this.props;

    const { historyPosition, history, urlInAddressBar } = this.state;

    const url = urlInAddressBar || defaultUrl;

    // Weird TS typing bug
    const AnySpring = Spring as any;

    return (
      <Container
        className={className}
        style={{
          position: 'relative',
          flex: 1,
          display: hide ? 'none' : undefined,
        }}
      >
        {showNavigation && (
          <Navigator
            url={decodeURIComponent(url)}
            onChange={this.updateUrl}
            onConfirm={this.sendUrl}
            onBack={historyPosition > 0 ? this.handleBack : null}
            onForward={
              historyPosition < history.length - 1 ? this.handleForward : null
            }
            onRefresh={this.handleRefresh}
            isProjectView={isInProjectView}
            toggleProjectView={onToggleProjectView}
            openNewWindow={this.openNewWindow}
            zenMode={zenMode}
          />
        )}

        <AnySpring
          from={{ opacity: 0 }}
          to={{
            opacity: screenshotUrl ? 0 : 1,
          }}
        >
          {(style: { opacity: number }) => (
            <React.Fragment>
              <StyledFrame
                sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
                allow="geolocation; microphone; camera;midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media"
                src={defaultUrl}
                id="sandbox"
                title={title}
                ref={el => {
                  if (el) {
                    this.el = el;
                    this.initializeFrame();
                  }
                }}
                style={{
                  ...style,
                  zIndex: 1,
                  backgroundColor: 'white',
                  pointerEvents: this.props.isResizing ? 'none' : 'initial',
                }}
              />

              {screenshotUrl && style.opacity !== 1 && (
                <div
                  style={{
                    overflow: 'hidden',
                    width: '100%',
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 35,
                    zIndex: 0,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      filter: `blur(2px)`,
                      transform: 'scale(1.025, 1.025)',
                      backgroundImage: `url("${screenshotUrl}")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPositionX: 'center',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          )}
        </AnySpring>
      </Container>
    );
  }
}
