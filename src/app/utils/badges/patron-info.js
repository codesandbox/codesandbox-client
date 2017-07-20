import Patron1 from './svg/patron-1.svg';
import Patron2 from './svg/patron-2.svg';
import Patron3 from './svg/patron-3.svg';
import Patron4 from './svg/patron-4.svg';

const info = {
  'patron-1': {
    Badge: Patron1,
    particleCount: 10,
    colors: ['#1BB978'],
  },
  'patron-2': {
    Badge: Patron2,
    particleCount: 20,
    colors: ['#B53D3D', '#1BB978'],
  },
  'patron-3': {
    Badge: Patron3,
    particleCount: 35,
    colors: ['#609AC3', '#1BB978', '#B53D3D'],
  },
  'patron-4': {
    Badge: Patron4,
    particleCount: 100,
    colors: ['#D0AF72', '#1BB978', '#B53D3D', '#609AC3'],
  },
};

// Preload the images
Object.keys(info).forEach(badge => {
  new Image().src = info[badge].Badge;
});

export default info;
