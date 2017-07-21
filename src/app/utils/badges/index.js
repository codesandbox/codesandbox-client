/* @flow */
import type { Badge } from 'common/types';

import Patron4 from './svg/patron-4.svg';
import Patron3 from './svg/patron-3.svg';
import Patron2 from './svg/patron-2.svg';
import Patron1 from './svg/patron-1.svg';

export function findPatronBadge(badges: Array<Badge>): ?Badge {
  return badges.find(b => b.id.startsWith('patron'));
}

export default function getBadge(badgeId: string): string {
  if (badgeId === 'patron_4') return Patron4;
  if (badgeId === 'patron_3') return Patron3;
  if (badgeId === 'patron_2') return Patron2;
  if (badgeId === 'patron_1') return Patron1;

  return '';
}
