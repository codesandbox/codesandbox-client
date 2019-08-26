import {
  Category,
  Font,
  Script,
  SortOption,
  Variant,
} from '@samuelmeuli/font-manager';

type LoadingStatus = 'loading' | 'finished' | 'error';

export type Props = {
  // Required props
  apiKey: string;
  activeFontFamily: string;
  onChange: (font: Font) => void;

  // Optional props
  pickerId: string;
  families: string[];
  categories: Category[];
  scripts: Script[];
  variants: Variant[];
  limit: number;
  sort: SortOption;
};

export type State = {
  expanded: boolean;
  loadingStatus: LoadingStatus;
  searchTerm: string;
};
