import React, { useState, useEffect } from 'react';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';
import { BackwardIcon, ForwardIcon, RefreshIcon } from './icons';
import { splitUrl } from './utils';

const NavigatorContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '$neutral900',
  height: 40,
  borderBottom: '1px solid $neutral800',
  padding: '$2 $4',

  '& > *:nth-child(n+3)': {
    marginLeft: '$2',
  },
});

const NavigatorInput = styled('input', {
  backgroundColor: '$neutral1000',
  color: '$neutral100',
  padding: '$1 $2',
  borderRadius: '$default',
  border: 0,
  flex: 1,
  height: '24px',
  fontSize: '$2',
});

const NavigatorButton = styled('button', {
  padding: 0,
  border: '0',
  display: 'flex',
  alignItems: 'center',
  color: '$neutral100',
  background: 'transparent',
  transition: 'all 0.15s ease-out',

  ':disabled': { color: '$neutral500' },

  ':hover': { color: '$neutral500' },
});

type UrlChangeMessage = {
  url: string;
  back: boolean;
  forward: boolean;
};

export const Navigator = () => {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [relativeUrl, setRelativeUrl] = useState<string>('/');

  const [backEnabled, setBackEnabled] = useState(false);
  const [forwardEnabled, setForwardEnabled] = useState(false);

  const { sandpack, dispatch, listen } = useSandpack();

  useEffect(() => {
    const unsub = listen((message: any) => {
      if (message.type === 'urlchange') {
        const { url, back, forward } = message as UrlChangeMessage;

        const [newBaseUrl, newRelativeUrl] = splitUrl(url);

        setBaseUrl(newBaseUrl);
        setRelativeUrl(newRelativeUrl);
        setBackEnabled(back);
        setForwardEnabled(forward);
      }
    });

    return () => unsub();
  }, []);

  const commitUrl = () => {
    if (!sandpack.browserFrame) {
      return;
    }

    const newUrl = baseUrl + relativeUrl;
    sandpack.browserFrame.src = newUrl;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const path = e.target.value.startsWith('/')
      ? e.target.value
      : `/${e.target.value}`;

    setRelativeUrl(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      //  Enter
      e.preventDefault();
      e.stopPropagation();

      commitUrl();
    }
  };

  const handleRefresh = () => {
    dispatch({ type: 'refresh' });
  };

  const handleBack = () => {
    dispatch({ type: 'urlback' });
  };

  const handleForward = () => {
    dispatch({ type: 'urlforward' });
  };

  return (
    <NavigatorContainer>
      <NavigatorButton onClick={handleBack} disabled={!backEnabled}>
        <BackwardIcon />
      </NavigatorButton>
      <NavigatorButton onClick={handleForward} disabled={!forwardEnabled}>
        <ForwardIcon />
      </NavigatorButton>
      <NavigatorInput
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={relativeUrl}
      />
      <NavigatorButton onClick={handleRefresh}>
        <RefreshIcon />
      </NavigatorButton>
    </NavigatorContainer>
  );
};
