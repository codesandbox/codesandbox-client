import React from 'react';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import Layout from '../components/layout';

export default class HomePage extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.scrollCheck, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollCheck);
  }

  scrollCheck = () => {
    clearTimeout(this.timer);
    if (!document.body.classList.contains('disable-hover')) {
      document.body.classList.add('disable-hover');
      window.scrolling = true;
    }

    this.timer = setTimeout(() => {
      document.body.classList.remove('disable-hover');
      window.scrolling = false;
    }, 500);
  };

  render() {
    return (
      <Layout>
        <TitleAndMetaTags />
        <div style={{ textAlign: 'center', marginTop: 100 }}>
          <h1>CodeSandbox</h1>
          <h2>We are goth Glitch</h2>
        </div>
      </Layout>
    );
  }
}
