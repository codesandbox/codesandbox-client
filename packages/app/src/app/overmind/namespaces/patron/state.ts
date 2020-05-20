import { PatronBadge, PatronTier } from '@codesandbox/common/lib/types';
import { derived } from 'overmind';

type State = {
  price: number;
  isUpdatingSubscription: boolean;
  tier: PatronTier;
  error: string | null;
  badge: PatronBadge;
};

export const state: State = {
  price: 10,
  error: null,
  isUpdatingSubscription: false,
  tier: derived(({ price }: State) => {
    if (price >= 20) return 4;
    if (price >= 15) return 3;
    if (price >= 10) return 2;

    return 1;
  }),
  badge: derived(({ tier }: State) => {
    switch (tier) {
      case 1:
        return PatronBadge.ONE;
      case 2:
        return PatronBadge.TWO;
      case 3:
        return PatronBadge.THREE;
      case 4:
        return PatronBadge.FOURTH;
      default: {
        const neverTier: never = tier;

        return neverTier;
      }
    }
  }),
};
