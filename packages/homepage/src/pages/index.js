import React from 'react';
import RecentPublications from '../screens/home/RecentPublications';
import Hero from '../screens/home/Hero';
import Explore from '../screens/home/Explore';
import Features from '../screens/home/Features';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import Layout from '../components/layout';
import Frameworks from '../screens/home/Frameworks';

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
        <Hero />
        <Explore />
        <Frameworks />
        <Features />
        <RecentPublications />
      </Layout>
    );
  }
}
