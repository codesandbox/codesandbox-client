import React from 'react';

import { Container } from './elements';

export default class Advertisement extends React.PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      const script = document.createElement('script');
      script.setAttribute(
        'src',
        '//cdn.carbonads.com/carbon.js?zoneid=1673&serve=C6AILKT&placement=codesandboxio'
      );
      script.async = 'true';
      document.head.appendChild(script);
    });
  }

  render() {
    return (
      <Container>
        <script
          id="_carbonads_js"
          src="//cdn.carbonads.com/carbon.js?zoneid=1673&serve=C6AILKT&placement=codesandboxio"
          async="true"
        />
      </Container>
    );
  }
}
