import * as React from 'react';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';
import { BackwardIcon, ForwardIcon, RefreshIcon } from './icons';
import { splitUrl } from './utils';

const NavigatorContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '$mainBackground',
  height: 40,
  border: '1px solid $inactive',
  margin: -1,
  padding: '$2 $4',
});

const NavigatorButtons = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginRight: '$4',
});

const NavigatorInput = styled('input', {
  backgroundColor: '$inputBackground',
  color: '$highlightText',
  padding: '$1 $2',
  borderRadius: '$default',
  border: 0,
  flex: 1,
  width: 0,
  height: '24px',
  fontSize: '$default',
});

const NavigatorButton = styled('button', {
  padding: 0,
  border: '0',
  display: 'flex',
  alignItems: 'center',
  color: '$defaultText',
  background: 'transparent',

  ':disabled': { color: '$inactive' },

  ':hover': { color: '$highlightText' },
});

type UrlChangeMessage = {
  url: string;
  back: boolean;
  forward: boolean;
};

export interface NavigatorProps {
  customStyle?: React.CSSProperties;
}

export const Navigator: React.FC<NavigatorProps> = ({ customStyle }) => {
  const [baseUrl, setBaseUrl] = React.useState<string>('');
  const [relativeUrl, setRelativeUrl] = React.useState<string>('/');

  const [backEnabled, setBackEnabled] = React.useState(false);
  const [forwardEnabled, setForwardEnabled] = React.useState(false);

  const { sandpack, dispatch, listen } = useSandpack();

  React.useEffect(() => {
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
    <NavigatorContainer style={customStyle}>
      <NavigatorButtons>
        <NavigatorButton onClick={handleBack} disabled={!backEnabled}>
          <BackwardIcon />
        </NavigatorButton>
        <NavigatorButton onClick={handleForward} disabled={!forwardEnabled}>
          <ForwardIcon />
        </NavigatorButton>
        <NavigatorButton onClick={handleRefresh}>
          <RefreshIcon />
        </NavigatorButton>
      </NavigatorButtons>
      <NavigatorInput
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={relativeUrl}
      />
    </NavigatorContainer>
  );
};
