import React from 'react';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import Layout from '../components/layout';
import Hero from '../screens/home/hero';
import Prototype from '../screens/home/prototype';
import Started from '../screens/home/started';
import LoadInView from '../components/LoadInView';
import Experiment from '../screens/home/experiment';
import Teams from '../screens/home/teams';
import Share from '../screens/home/share';
import Join from '../screens/home/join';
import Explore from '../screens/home/explore';

const Homepage = () => (
  <Layout>
    <TitleAndMetaTags />
    <section
      css={`
        margin-bottom: 8rem;
      `}
    >
      <Hero />
    </section>
    <LoadInView>
      <Prototype />
    </LoadInView>
    <LoadInView>
      <Started />
    </LoadInView>
    <LoadInView>
      <Explore />
    </LoadInView>
    <LoadInView>
      <Experiment />
    </LoadInView>
    <LoadInView>
      <Teams />
    </LoadInView>
    <LoadInView>
      <Share />
    </LoadInView>
    <LoadInView>
      <Join />
    </LoadInView>
  </Layout>
);

export default Homepage;
