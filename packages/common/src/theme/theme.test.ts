import { theme } from './theme';

describe('theme', () => {
  it('has a theme', () => {
    expect(theme).toMatchSnapshot();
  });

  it('can adjust colors', () => {
    expect(theme.background.darken(0.5)()).toMatchSnapshot();
  });

  it('can chain color adjustments', () => {
    expect(theme.background.darken(0.5).lighten(0.2)()).toMatchSnapshot();
  });
});
