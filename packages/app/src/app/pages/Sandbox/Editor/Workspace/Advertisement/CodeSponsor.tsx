import * as React from 'react';
import './CodeSponsor.css';

type Props = {
  token: string,
  theme: 'dark' | 'light',
};

const CodeSponsor: React.SFC<Props> = ({ token, theme }: Props) => {
  const pixelHref = `https://codesponsor.io/t/l/${token}/pixel.png`;
  const linkHref = `https://codesponsor.io/t/c/${token}/`;

  return (
    <div className={theme === 'dark' ? 'cs__wrapper dark' : 'cs__wrapper'}>
      <div className="cs__header">Proudly sponsored by</div>
      <a href={linkHref} className="cs__blurb" target="_blank" rel="noopener">
        <strong>Rollbar</strong>{' '}
        <span>
          Real-time error monitoring, alerting, and analytics for software developers{' '}
          <span aria-label="rocket" role="img">
            🚀
          </span>
        </span>
      </a>
      <img alt="CodeSponsor" className="cs__pixel" src={pixelHref} />
    </div>
  );
};

export default CodeSponsor
