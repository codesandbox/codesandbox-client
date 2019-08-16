import getTemplate from '@codesandbox/common/lib/templates';
import {
  sandboxUrl,
  profileUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { observer } from 'app/componentConnectors';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import EyeIcon from 'react-icons/lib/fa/eye';
import GithubIcon from 'react-icons/lib/fa/github';

import {
  Container,
  SandboxImageContainer,
  SandboxImage,
  SandboxInfo,
  ImageMessage,
  SandboxTitle,
  Avatar,
  Details,
  FlexCenter,
  Pick,
} from './elements';

type Props = {
  author: object,
  description: string,
  git: object,
  id: string,
  title: string,
  viewCount: number,
};

const SandboxCard = ({
  author,
  description,
  git,
  id,
  picks,
  pickSandbox,
  screenshotUrl,
  template,
  title,
  viewCount,
}: Props) => {
  const [screenShotURL, setScreenShotURL] = useState(screenshotUrl);
  const screenShotTimeout = useRef(null);

  const hasScreenshot = useCallback(() => {
    const templateDefinition = getTemplate(template);

    return !templateDefinition.isServer;
  }, [template]);

  const requestScreenshot = useCallback(() => {
    setScreenShotURL(`/api/v1/sandboxes/${id}/screenshot.png`);
  }, [id]);
  const checkScreenShot = useCallback(() => {
    if (!screenShotURL && hasScreenshot()) {
      // We only request the screenshot if the sandbox card is in view for > 1 second
      screenShotTimeout.current = setTimeout(requestScreenshot, 1000);
    }
  }, [hasScreenshot, requestScreenshot, screenShotURL]);
  useEffect(() => {
    checkScreenShot();

    return () => clearTimeout(screenShotTimeout.current);
  }, [checkScreenShot]);

  const openSandbox = useCallback(() => {
    const url = sandboxUrl({ id });

    window.open(url, '_blank');
  }, [id]);

  const getImageMessage = useCallback(() => {
    const templateDefinition = getTemplate(template);

    if (templateDefinition.isServer) {
      return `Container Sandbox`;
    }

    if (process.env.STAGING) {
      return `Staging Sandbox`;
    }

    return `Generating Screenshot...`;
  }, [template]);

  const openUser = useCallback(username => {
    const url = profileUrl(username);

    window.open(url, '_blank');
  }, []);

  const templateInfo = getTemplate(template);

  return (
    <div
      style={{ backgroundColor: 'transparent', borderRadius: 2, padding: 2 }}
    >
      <Container style={{ outline: 'none' }}>
        <SandboxImageContainer onClick={openSandbox} role="button" tabIndex={0}>
          <ImageMessage>{getImageMessage()}</ImageMessage>

          {hasScreenshot() && (
            <SandboxImage
              style={{ backgroundImage: `url(${screenShotURL})` }}
            />
          )}
        </SandboxImageContainer>

        <SandboxInfo>
          <div
            style={{
              backgroundColor: templateInfo.color(),
              bottom: 0,
              height: 'calc(100% + 34px)',
              left: 0,
              position: 'absolute',
              top: 0,
              width: 2,
            }}
          />
          <div style={{ flex: 1 }}>
            <div role="button" tabIndex={0} onClick={openSandbox}>
              <SandboxTitle>{title || id}</SandboxTitle>
              {description}
            </div>

            <Details>
              {author ? (
                <FlexCenter
                  onClick={() => openUser(author.username)}
                  role="button"
                  tabIndex={0}
                >
                  <Avatar alt={author.username} src={author.avatarUrl} />

                  {author.name || author.username}
                </FlexCenter>
              ) : null}

              <FlexCenter onClick={openSandbox} role="button" tabIndex={0}>
                <EyeIcon style={{ marginRight: '0.5rem' }} />

                {viewCount}
              </FlexCenter>

              {git ? (
                <FlexCenter>
                  <a
                    href={`https://github.com/${git.username}/${git.repo}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <GithubIcon style={{ marginRight: '0.5rem' }} />
                  </a>
                </FlexCenter>
              ) : null}
            </Details>
          </div>
        </SandboxInfo>

        <Pick onClick={() => pickSandbox(id, title, description)} small>
          {!picks.length ? '✨ Pick Sandbox' : '✨ Pick Sandbox again'}
        </Pick>
      </Container>
    </div>
  );
};

export default observer(SandboxCard);
