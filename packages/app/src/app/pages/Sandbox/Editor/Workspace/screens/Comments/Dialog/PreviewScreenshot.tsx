import React from 'react';
import css from '@styled-system/css';
import { Element, Stack, Tooltip } from '@codesandbox/components';
import { Image } from 'app/components/Markdown/Image';
import { UserAgentDetails } from 'app/overmind/effects/browser';
import {
  OperaIcon,
  FirefoxIcon,
  ChromeIcon,
  EdgeIcon,
  SafariIcon,
  BraveIcon,
} from './BrowserIcons';

const Icon = ({ name }) => {
  const iconToName = {
    Chrome: ChromeIcon,
    Safari: SafariIcon,
    'Mobile Safari': SafariIcon,
    Opera: OperaIcon,
    Firefox: FirefoxIcon,
    Edge: EdgeIcon,
    Brave: BraveIcon,
  };

  return iconToName[name] ? iconToName[name]() : null;
};

export const PreviewScreenshot: React.FC<{
  width: number;
  height: number;
  url: string;
  userAgentDetails: UserAgentDetails | null;
}> = ({ url, userAgentDetails, width, height }) => (
  <Element
    css={css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 4,
      position: 'relative',
      img: {
        maxWidth: '100%',
      },
    })}
  >
    <Image src={url} alt="Preview Screenshot" ignorePrivateSandboxRestriction />
    {userAgentDetails ? (
      <Tooltip
        label={
          <Element
            css={css({
              textAlign: 'left',
              fontSize: 12,
              lineHeight: '16px',
            })}
          >
            {userAgentDetails.browser.name} {userAgentDetails.browser.version}{' '}
            <br />
            {userAgentDetails.os.name} {userAgentDetails.os.version}
            <br />
            {width}x{height}
          </Element>
        }
      >
        <Stack
          align="center"
          justify="center"
          css={css({
            width: 6,
            height: 6,
            top: 4,
            right: 4,
            borderRadius: 'medium',
            position: 'absolute',
            backgroundColor: 'sideBar.background',
          })}
        >
          <Icon name={userAgentDetails.browser.name} />
        </Stack>
      </Tooltip>
    ) : null}
  </Element>
);
