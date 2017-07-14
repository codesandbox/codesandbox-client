import Rupee from './svg/RupeeBadge.svg';
import Sapphire from './svg/SapphireBadge.svg';
import Ruby from './svg/RubyBadge.svg';
import Diamond from './svg/DiamondBadge.svg';

const info = {
  ruby: {
    Badge: Ruby,
    particleCount: 10,
    color: '#D9411C',
  },
  sapphire: {
    Badge: Sapphire,
    particleCount: 15,
    color: '#BA11D6',
  },
  rupee: {
    Badge: Rupee,
    particleCount: 25,
    color: '#45CB3B',
  },
  diamond: {
    Badge: Diamond,
    particleCount: 40,
    color: '#61B7E6',
  },
};

// Preload the images
Object.keys(info).forEach(badge => {
  new Image().src = info[badge].Badge;
});

export default info;
