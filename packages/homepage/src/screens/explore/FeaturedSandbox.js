import React from 'react';
import Preview from 'app/src/app/components/Preview';
import { camelizeKeys } from 'humps';
import { profileUrl, protocolAndHost } from 'common/utils/url-generator';

import getIcon from 'common/templates/icons';

import { Spring, animated, Transition } from 'react-spring';

import {
  Container,
  SandboxContainer,
  SandboxInfo,
  Title,
  Description,
  Author,
  IconContainer,
  StyledStats,
  SandboxPreviewImage,
} from './_FeaturedSandbox.elements';

const SandboxIcon = ({ template }) => {
  const Icon = getIcon(template);

  return (
    <IconContainer>
      <Icon />
    </IconContainer>
  );
};

export default class FeaturedSandbox extends React.PureComponent {
  state = {
    sandbox: undefined,
    showPreview: false,
  };
  fetchedSandboxes = {};

  fetchSandbox = (id: string) => {
    if (this.fetchedSandboxes[id]) {
      return Promise.resolve(this.fetchedSandboxes[id]);
    }

    return fetch(`${protocolAndHost()}/api/v1/sandboxes/${id}`)
      .then(x => x.json())
      .then(x => {
        this.fetchedSandboxes[x.data.id] = x.data;

        return x.data;
      });
  };

  componentDidMount() {
    this.fetchSandbox(this.props.sandboxId).then(sandbox => {
      this.setState({ sandbox });

      setTimeout(() => {
        // Only load it later so everything else can initialize
        this.setState({ showPreview: true });
        this.fetchAllFeaturedSandboxes();
      }, 1000);
    });
  }

  fetchAllFeaturedSandboxes = () => {
    this.props.featuredSandboxes.forEach(s => {
      this.fetchSandbox(s.sandboxId);
    });
  };

  async componentWillReceiveProps(nextProps) {
    if (nextProps.sandboxId !== this.props.sandboxId) {
      this.fetchSandbox(nextProps.sandboxId).then(sandbox => {
        this.setState({ sandbox });
      });
    }
  }

  render() {
    const { sandbox } = this.state;
    const { title, description } = this.props;
    return (
      <Container>
        <SandboxContainer>
          <SandboxInfo>
            <Title>{title}</Title>
            <Description>{description}</Description>
            {sandbox && (
              <Spring
                from={{ height: 0, opacity: 0, overflow: 'hidden' }}
                to={{ height: 28, opacity: 1 }}
              >
                {style => (
                  <StyledStats
                    style={style}
                    viewCount={sandbox.view_count}
                    likeCount={sandbox.like_count}
                    forkCount={sandbox.fork_count}
                  />
                )}
              </Spring>
            )}
          </SandboxInfo>

          {sandbox && (
            <Spring
              native
              from={{ height: 0, opacity: 0, overflow: 'hidden' }}
              to={{ height: 28, opacity: 1 }}
            >
              {style => (
                <animated.div style={style}>
                  {sandbox.author && (
                    <a href={profileUrl(sandbox.author.username)}>
                      <Author
                        username={sandbox.author.username}
                        avatarUrl={sandbox.author.avatar_url}
                      />
                    </a>
                  )}
                  <SandboxIcon template={sandbox.template} />
                </animated.div>
              )}
            </Spring>
          )}
        </SandboxContainer>

        {typeof window === 'undefined' ? (
          <div style={{ flex: 1, opacity: 1 }}>
            <div
              style={{
                zIndex: 2,
                height: 48,
                minHeight: 48,
                backgroundColor: '#eee',
              }}
            />
            <SandboxPreviewImage>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'white',
                  backgroundImage: `url(${sandbox && sandbox.screenshot_url})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPositionX: 'center',
                  transform: 'scale(1.025, 1.025)',
                  filter: 'blur(2px)',
                  marginTop: -8,
                }}
              />
            </SandboxPreviewImage>
          </div>
        ) : (
          <Transition
            items={this.state.showPreview}
            from={{ flex: 1, opacity: 1 }}
            enter={{ opacity: 1, flex: 1 }}
            leave={{
              opacity: 0,
              flex: 1,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              right: 0,
            }}
            native
          >
            {show =>
              show
                ? style => (
                    <animated.div style={style}>
                      <Preview
                        sandbox={camelizeKeys(sandbox)}
                        settings={{}}
                        template={sandbox.template}
                        isInProjectView
                        noDelay
                      />
                    </animated.div>
                  )
                : style => (
                    <animated.div style={style}>
                      <div
                        style={{
                          zIndex: 2,
                          height: 48,
                          minHeight: 48,
                          backgroundColor: '#eee',
                        }}
                      />
                      <SandboxPreviewImage>
                        <div
                          style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: 'white',
                            backgroundImage: `url(${sandbox &&
                              sandbox.screenshot_url})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPositionX: 'center',
                            transform: 'scale(1.025, 1.025)',
                            filter: 'blur(2px)',
                            marginTop: -8,
                          }}
                        />
                      </SandboxPreviewImage>
                    </animated.div>
                  )
            }
          </Transition>
        )}
      </Container>
    );
  }
}
