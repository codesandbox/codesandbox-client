import React from 'react';

export default class Advertisement extends React.PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      const script = document.createElement('script');
      script.setAttribute(
        'src',
        'https://app.codesponsor.io/scripts/o81cdkzTVQe3UbTW0J2EQw?theme=dark&height=150&image=hide'
      );
      script.async = true;
      document.head.appendChild(script);
    });
  }

  render() {
    return (
      <div style={{ paddingTop: 3, borderTop: '1px solid rgba(0, 0, 0, 0.3)' }}>
        <div id="code-sponsor-widget" />
      </div>
    );
  }
}
