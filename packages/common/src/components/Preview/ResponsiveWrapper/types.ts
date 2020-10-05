export type ResponsiveWrapperProps = {
  on: boolean;
  props: {
    theme: any;
    state: {
      responsive: {
        presets: { [name: string]: [number, number] };
        defaultPresets: { [name: string]: [number, number] };
        scale: number;
        resolution: [number, number];
      };
      mode: 'responsive' | null;
    };
    actions: {
      setResolution: (size: number[]) => void;
      openDeletePresetModal: () => void;
      openAddPresetModal: () => void;
      toggleEditPresets: () => void;
      editPresets: (data: Object) => void;
    };
  };
  children?: any;
};
