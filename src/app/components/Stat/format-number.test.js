import formatNumber from './format-number';

describe('formatNumber', () => {
  it('handles all numbers under 1000', () => {
    expect(formatNumber(42)).toMatchSnapshot();
    expect(formatNumber(142)).toMatchSnapshot();
    expect(formatNumber(999)).toMatchSnapshot();
    expect(formatNumber(1)).toMatchSnapshot();
    expect(formatNumber(0)).toMatchSnapshot();
  });

  it('handles all numbers over 1000', () => {
    expect(formatNumber(1042)).toMatchSnapshot();
    expect(formatNumber(1142)).toMatchSnapshot();
    expect(formatNumber(1000)).toMatchSnapshot();
    expect(formatNumber(2099)).toMatchSnapshot();
    expect(formatNumber(20299)).toMatchSnapshot();
  });
});
