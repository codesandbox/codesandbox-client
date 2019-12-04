import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import ContributorsBadge from '.';

describe('<ContributorsBadge /> rendering', () => {
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
