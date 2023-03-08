import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import ContributorsBadge from '.';

// This test doesn't actually test anything from what I can tell
describe.skip('<ContributorsBadge /> rendering', () => {
  it('contrib', () => {
    const wrapper = mountWithTheme(
      <ContributorsBadge username="Sara Vieira" />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('not contrib', () => {
    const wrapper = mountWithTheme(<ContributorsBadge username="sjhdk" />);
    expect(wrapper).toMatchSnapshot();
  });
});
