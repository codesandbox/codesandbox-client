import React from 'react';

export default class Advertisement extends React.PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      const script = document.createElement('script');
      script.setAttribute(
        'src',
        'https://app.codesponsor.io/scripts/o81cdkzTVQe3UbTW0J2EQw?theme=dark&height=120&image=hide'
      );
      script.async = true;
      document.head.appendChild(script);
    });
  }

  render() {
    return (
      <div>
        <div id="code-sponsor-widget" />
      </div>
    );
  }
}
