/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';

import TitleAndMetaTags from '../components/TitleAndMetaTags';

import Layout, { WRAPPER_STYLING } from '../components/layout';

import Hero from '../screens/home/hero';
import DevExperience from '../screens/home/devExperience';
import LoadInView from '../components/LoadInView';
import Quotes from '../screens/home/quotes';
import Teams from '../screens/home/teams';
import Explore from '../screens/home/explore';
import Video from '../screens/home/video';
import Workspaces from '../screens/home/workspaces';

// eslint-disable-next-line
console.log(
  'Hi, We love curious people that dive in to see how things are working! We are always looking for talented, hard working people. Drop us a line and show us your work. We are hiring: https://codesandbox.io/jobs'
);

const Homepage = () => (
  <Layout noWrapperStyling>
    <TitleAndMetaTags />

    <section
      css={`
        margin-bottom: 8rem;
        max-width: 100vw;

        ${props => props.theme.breakpoints.md} {
          overflow: visible;
        }
      `}
    >
      <Hero />
      <Video />
    </section>

    <div style={WRAPPER_STYLING}>
      <LoadInView>
        <DevExperience />
      </LoadInView>
      <LoadInView>
        <Workspaces />
      </LoadInView>
      <LoadInView>
        <Teams />
      </LoadInView>

      <LoadInView>
        <Quotes />
      </LoadInView>
    </div>
    <LoadInView>
      <Explore />
    </LoadInView>
    {/* <div style={WRAPPER_STYLING}>
      <LoadInView>
        <Experiment />
      </LoadInView>
      <LoadInView>
        <Share />
      </LoadInView>
      <LoadInView>
        <Join />
      </LoadInView>
    </div> */}
  </Layout>
);

export default Homepage;
