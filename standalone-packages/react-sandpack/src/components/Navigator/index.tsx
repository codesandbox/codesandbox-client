import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { useSandpack } from '../../hooks/useSandpack';
import { BackwardIcon, ForwardIcon, RefreshIcon } from '../../icons';
import { splitUrl } from './utils';

type UrlChangeMessage = {
  url: string;
  back: boolean;
  forward: boolean;
};

export const Navigator: React.FC = () => {
  const [baseUrl, setBaseUrl] = React.useState<string>('');
  const [relativeUrl, setRelativeUrl] = React.useState<string>('/');

  const [backEnabled, setBackEnabled] = React.useState(false);
  const [forwardEnabled, setForwardEnabled] = React.useState(false);

  const { sandpack, dispatch, listen } = useSandpack();
  const c = useClasser('sp');

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
    if (!sandpack.iframeRef.current) {
      return;
    }

    const newUrl = baseUrl + relativeUrl;
    sandpack.iframeRef.current.src = newUrl;
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
    <div className={c('navigator')}>
      <button
        className={c('button', 'icon')}
        type="button"
        onClick={handleBack}
        disabled={!backEnabled}
        aria-label="Go back one page"
      >
        <BackwardIcon />
      </button>
      <button
        className={c('button', 'icon')}
        type="button"
        onClick={handleForward}
        disabled={!forwardEnabled}
        aria-label="Go forward one page"
      >
        <ForwardIcon />
      </button>
      <button
        className={c('button', 'icon')}
        type="button"
        onClick={handleRefresh}
        aria-label="Refresh page"
      >
        <RefreshIcon />
      </button>

      <input
        className={c('input')}
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
