import React from 'react';

import Animation from '../screens/home/Animation';
import NPMFeature from '../screens/home/NPMFeature';
import CycleFeature from '../screens/home/CycleFeature';
import ExtraFeatures from '../screens/home/ExtraFeatures';
import Footer from '../screens/home/Footer';
import RecentPublications from '../screens/home/RecentPublications';
import Patron from '../screens/home/Patron';

export default class HomePage extends React.PureComponent {
  componentDidMount() {
    window.addEventListener('scroll', this.scrollCheck, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollCheck);
  }

  scrollCheck = () => {
    clearTimeout(this.timertimer);
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
        <Animation />
        <NPMFeature />
        <CycleFeature />
        <ExtraFeatures />
        <RecentPublications sizes={this.props.data.publicationImages.edges} />
        <Patron />
        <Footer />
      </div>
    );
  }
}

export const query = graphql`
  query ImageSizesQuery {
    publicationImages: allImageSharp(
      filter: { id: { regex: "/RecentPublications/" } }
    ) {
      edges {
        node {
          id
          sizes(maxWidth: 400) {
            ...GatsbyImageSharpSizes
          }
        }
      }
    }
  }
`;
