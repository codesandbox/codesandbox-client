import RupeeImage from './svg/RupeeBadge.svg';
import SapphireImage from './svg/SapphireBadge.svg';
import RubyImage from './svg/RubyBadge.svg';
import DiamondImage from './svg/DiamondBadge.svg';

export default function getBadge(badgeId: string): string {
  if (badgeId === 'patron_diamond') return DiamondImage;
  if (badgeId === 'patron_ruby') return RubyImage;
  if (badgeId === 'patron_sapphire') return SapphireImage;
  if (badgeId === 'patron_rupee') return RupeeImage;

  return '';
}
