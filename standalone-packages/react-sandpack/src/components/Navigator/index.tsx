import * as React from 'react';

import { useSandpack } from '../../contexts/sandpack-context';
import { BackwardIcon, ForwardIcon, RefreshIcon } from '../../icons';
import { splitUrl } from './utils';

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
  }, [sandpack.status]);

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
    <div className="sp-navigator" style={customStyle}>
      <button
        className="sp-button icon"
        type="button"
        onClick={handleBack}
        disabled={!backEnabled}
        aria-label="Go back one page"
      >
        <BackwardIcon />
      </button>
      <button
        className="sp-button icon"
        type="button"
        onClick={handleForward}
        disabled={!forwardEnabled}
        aria-label="Go forward one page"
      >
        <ForwardIcon />
      </button>
      <button
        className="sp-button icon"
        type="button"
        onClick={handleRefresh}
        aria-label="Refresh page"
      >
        <RefreshIcon />
      </button>

      <input
        className="sp-input"
        style={{ flex: 1, width: 0, marginLeft: 'var(--sp-space-4)' }}
        type="text"
        name="Current Sandpack URL"
        aria-label="Current Sandpack URL"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={relativeUrl}
      />
    </div>
  );
};
