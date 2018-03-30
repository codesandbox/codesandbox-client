import React from 'react';

import Animation from '../screens/home/Animation';
import NPMFeature from '../screens/home/NPMFeature';
import CycleFeature from '../screens/home/CycleFeature';
import ExtraFeatures from '../screens/home/ExtraFeatures';
import RecentPublications from '../screens/home/RecentPublications';
import Patron from '../screens/home/Patron';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

console.log(NPMFeature);

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
      <div>
        <TitleAndMetaTags />

        <Animation />
        <NPMFeature />
        <CycleFeature />
        <ExtraFeatures />
        <RecentPublications />
        <Patron />
      </div>
    );
  }
}
