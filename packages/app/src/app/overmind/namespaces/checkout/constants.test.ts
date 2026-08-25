import { BUILDER_PLAN, FREE_PLAN, PRO_PLAN } from './constants';

describe('plan credit defaults', () => {
  it('does not include VM credits on the Free/Build plan', () => {
    expect(FREE_PLAN.credits).toBe(0);
    expect(
      FREE_PLAN.usage.some(item => /credit|40 hours/i.test(item))
    ).toBe(false);
  });

  it('keeps included credits on paid plans', () => {
    expect(PRO_PLAN.credits).toBe(1000);
    expect(PRO_PLAN.usage).toContain(
      'Start from 100 hours of monthly VM credits'
    );
    expect(BUILDER_PLAN.credits).toBe(1600);
    expect(BUILDER_PLAN.usage).toContain(
      'Start from 160 hours of monthly VM credits'
    );
  });
});
