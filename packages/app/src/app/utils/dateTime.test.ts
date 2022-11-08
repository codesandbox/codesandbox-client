import { getDaysUntil } from './dateTime';

describe(getDaysUntil, () => {
  it('returns 0 if the date is today', () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() + 30); // 30 minutes ahead
    expect(getDaysUntil(today.toISOString())).toBe(0);
  });

  it('returns null if the target is behind now', () => {
    const target = new Date();
    target.setMinutes(target.getMinutes() - 30); // 30 minutes behind
    expect(getDaysUntil(target.toISOString())).toBe(null);
  });

  it('returns 1 if the date is tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(11, 0, 0, 0); // Random hour
    expect(getDaysUntil(tomorrow.toISOString())).toBe(1);
  });

  it('returns 10 if the date is 10 days from now', () => {
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 10);
    fiveDaysFromNow.setHours(5, 0, 0, 0); // Random hour
    expect(getDaysUntil(fiveDaysFromNow.toISOString())).toBe(10);
  });
});
