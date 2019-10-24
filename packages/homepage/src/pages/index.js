import React from 'react';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import Layout from '../components/layout';
import Hero from '../screens/home/hero';
import Prototype from '../screens/home/prototype';
import Started from '../screens/home/started';
import LoadInView from '../components/LoadInView';

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
  </Layout>
);

export default Homepage;
