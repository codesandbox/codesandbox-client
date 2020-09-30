type State = {
  responsive: {
    defaultPresets: { [name: string]: [number, number] };
    scale: 'fit-to-preview' | number;
    resolution: [number, number];
  };
  mode: 'responsive' | null;
};

export const state: State = {
  responsive: {
    defaultPresets: {
      Mobile: [320, 675],
      Tablet: [1024, 765],
      Desktop: [1920, 1080],
      'Desktop HD': [1400, 800],
    },
    scale: 100,
    resolution: [320, 675],
  },
  mode: 'responsive',
};
