import React from 'react';

const CODEFUND_LINK =
  'https://codefund.io/scripts/1fc4e04d-9622-4844-81f9-7522c7d19ac7/embed.js?theme=codesandbox';
let loaded = false;

export default class CodeFund extends React.PureComponent {
  componentDidMount() {
    if (!loaded) {
      loaded = true;

      const script = document.createElement('script');
      script.setAttribute('src', CODEFUND_LINK);
      script.async = 'true';
      script.setAttribute('id', 'external-js');
      document.head.appendChild(script);
    }
  }

  render() {
    return (
      <div>
        <div id="codefund_ad" />
      </div>
    );
  }
}
