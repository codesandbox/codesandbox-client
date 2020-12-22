import React, { useState, useEffect } from 'react';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';
import { BackwardIcon, ForwardIcon, RefreshIcon } from './icons';
import { splitUrl } from './utils';

const NavigatorContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgb(245, 245, 245)',
  width: '100%',
  padding: '0.5rem',
  borderRadius: '2px',
  borderBottom: '1px solid #ddd',
  '&:first-child': { marginLeft: '0' },
  '&:last-child': { marginLeft: '0' },
});

const NavigatorInput = styled('input', {
  backgroundColor: 'white',
  width: '100%',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '0.875rem',
  margin: '0 0.25rem',
  flex: 1,
});

const NavigatorButton = styled('button', {
  transition: '0.3s ease background-color',
  padding: '2px',
  margin: '0 0.25rem',
  fontSize: '1.25rem',
  backgroundColor: 'transparent',
  border: '0',
  outline: '0',
  display: 'flex',
  alignItems: 'center',
  color: 'rgb(114, 114, 114)',
  verticalAlign: 'middle',

  ':disabled': { color: 'rgb(170, 170, 170)' },

  ':hover:not(:disabled)': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
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
    const unsubscribe = listen((message: any) => {
      if (message.type === 'urlchange') {
        const { url, back, forward } = message as UrlChangeMessage;

        const [newBaseUrl, newRelativeUrl] = splitUrl(url);

        setBaseUrl(newBaseUrl);
        setRelativeUrl(newRelativeUrl);
        setBackEnabled(back);
        setForwardEnabled(forward);
      }
    });

    return unsubscribe;
  }, []);

  const commitUrl = () => {
    if (!sandpack.browserFrame) {
      return;
    }

    const newUrl = baseUrl + relativeUrl;
    sandpack.browserFrame.src = newUrl;
  };

  // TODO: Remove behavior with leading slash?
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
      <NavigatorButton onClick={handleRefresh}>
        <RefreshIcon />
      </NavigatorButton>
      <NavigatorInput
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={relativeUrl}
      />
    </NavigatorContainer>
  );
};
