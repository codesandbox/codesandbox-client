import React from 'react';

import Animation from '../screens/home/Animation';
import NPMFeature from '../screens/home/NPMFeature';
import CycleFeature from '../screens/home/CycleFeature';
import ExtraFeatures from '../screens/home/ExtraFeatures';
import Footer from '../screens/home/Footer';
import RecentPublications from '../screens/home/RecentPublications';

export default () => (
  <div style={{ marginBottom: 900 }} v>
    <Animation />
    <NPMFeature />
    <CycleFeature />
    <ExtraFeatures />
    <RecentPublications />
    <Footer />
  </div>
);
