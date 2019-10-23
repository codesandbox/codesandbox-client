import React from 'react';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import Layout from '../components/layout';
import Hero from '../screens/home/hero';
import Prototype from '../screens/home/prototype';
import Started from '../screens/home/started';

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
    <section
      css={`
        margin-bottom: 8rem;
      `}
    >
      <Prototype />
    </section>
    <section
      css={`
        margin-bottom: 8rem;
      `}
    >
      <Started />
    </section>
    <Hero /> <Hero /> <Hero /> <Hero /> <Hero />
  </Layout>
);

export default Homepage;
