import React, { useState, useEffect } from 'react';
import { listen } from 'codesandbox-api';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';
import { BackwardIcon, ForwardIcon, RefreshIcon } from './icons';
import { getBaseUrl, getRelativeUrl } from './utils';

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

export const Navigator = () => {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [relativeUrl, setRelativeUrl] = useState<string>('/');
  const [lastCommitedUrl, setLastCommitedUrl] = useState<string>('/');
  const [backwardNavigationStack, setBackwardNavigationStack] = useState<
    string[]
  >([]);
  const [forwardNavigationStack, setForwardNavigationStack] = useState<
    string[]
  >([]);

  const sandpack = useSandpack();

  useEffect(() => {
    const unsubscribe = listen((message: any) => {
      if (
        message.type === 'urlchange' ||
        (message.type === 'initialized' && message.url)
      ) {
        const newRelativeUrl = getRelativeUrl(message.url);

        setBaseUrl(getBaseUrl(message.url));
        setRelativeUrl(newRelativeUrl);
        setLastCommitedUrl(message.url);
      }
    });

    return unsubscribe;
  }, []);

  const commitUrl = () => {
    if (!sandpack.browserFrame) {
      return;
    }

    const prevUrl = sandpack.browserFrame.src;
    const newUrl = baseUrl + relativeUrl;
    sandpack.browserFrame.src = newUrl;

    setLastCommitedUrl(newUrl);
    setBackwardNavigationStack([...backwardNavigationStack, prevUrl]);
    setForwardNavigationStack([]);
  };

  // TODO: Remove behavior with leading slash?
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const path = e.target.value.startsWith('/')
      ? e.target.value
      : `/${e.target.value}`;

    setRelativeUrl(path);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      //  Enter
      e.preventDefault();
      e.stopPropagation();

      commitUrl();
    }
  };

  const onRefresh = () => {
    if (sandpack.browserFrame) {
      sandpack.browserFrame.src = lastCommitedUrl;
    }
  };

  const onBackwardNavigation = () => {
    if (backwardNavigationStack.length === 0 || !sandpack.browserFrame) {
      return;
    }

    const newUrl = backwardNavigationStack[backwardNavigationStack.length - 1];
    const newRelativePath = getRelativeUrl(newUrl);

    const prevUrl = sandpack.browserFrame.src;
    sandpack.browserFrame.src = newUrl;

    setRelativeUrl(newRelativePath);
    setLastCommitedUrl(newUrl);

    setBackwardNavigationStack(backwardNavigationStack.slice(0, -1));
    setForwardNavigationStack([...forwardNavigationStack, prevUrl]);
  };

  const onFowardNavigation = () => {
    if (forwardNavigationStack.length === 0 || !sandpack.browserFrame) {
      return;
    }

    const newUrl = forwardNavigationStack[forwardNavigationStack.length - 1];
    const newRelativePath = getRelativeUrl(newUrl);

    const prevUrl = sandpack.browserFrame.src;
    sandpack.browserFrame.src = newUrl;

    setRelativeUrl(newRelativePath);
    setLastCommitedUrl(newUrl);

    setBackwardNavigationStack([...backwardNavigationStack, prevUrl]);
    setForwardNavigationStack(forwardNavigationStack.slice(0, -1));
  };

  const backDisabled = backwardNavigationStack.length === 0;
  const forwardDisabled = forwardNavigationStack.length === 0;

  return (
    <NavigatorContainer>
      <NavigatorButton onClick={onBackwardNavigation} disabled={backDisabled}>
        <BackwardIcon />
      </NavigatorButton>
      <NavigatorButton onClick={onFowardNavigation} disabled={forwardDisabled}>
        <ForwardIcon />
      </NavigatorButton>
      <NavigatorButton onClick={onRefresh}>
        <RefreshIcon />
      </NavigatorButton>
      <NavigatorInput
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={relativeUrl}
      />
    </NavigatorContainer>
  );
};
