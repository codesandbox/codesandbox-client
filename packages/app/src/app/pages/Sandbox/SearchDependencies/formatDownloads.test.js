import formatDownloads from './formatDownloads';

describe('formatDownloads', () => {
  it('leaves numbers under 1000 unchanged', () => {
    expect(formatDownloads(0)).toBe('0');
    expect(formatDownloads(999)).toBe('999');
  });

  it('formats numbers between 1000000 and 1000 with "K"', () => {
    expect(formatDownloads(1000)).toBe('1K');
    expect(formatDownloads(1099)).toBe('1K');
    expect(formatDownloads(1100)).toBe('1.1K');
    expect(formatDownloads(999999)).toBe('999.9K');
  });

  it('formats numbers 1000000 and above "M"', () => {
    expect(formatDownloads(1000000)).toBe('1M');
    expect(formatDownloads(1100000)).toBe('1.1M');
    expect(formatDownloads(999999999)).toBe('999.9M');
  });
});
