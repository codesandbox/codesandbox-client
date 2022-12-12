import { DashboardSandbox, DashboardTemplate } from '../../types';

export interface SandboxItemComponentProps {
  noDrag?: boolean;
  autoFork?: boolean;
  sandbox: DashboardSandbox['sandbox'] | DashboardTemplate['sandbox'];
  sandboxTitle: string;
  sandboxLocation?: string;
  lastUpdated: string;
  viewCount: number | string;
  TemplateIcon: React.FC<{
    width: string;
    height: string;
    style?: React.CSSProperties;
  }>;
  PrivacyIcon: React.FC;
  screenshotUrl: string | null;

  isScrolling: boolean;
  selected: boolean;
  onClick?: (evt: React.MouseEvent) => void;
  onDoubleClick?: (evt: React.MouseEvent) => void;
  onBlur: (evt: React.FocusEvent) => void;
  onContextMenu: (evt: React.MouseEvent) => void;

  editing: boolean;
  newTitle: string | null;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (evt: React.FormEvent<HTMLFormElement>) => void;
  onInputBlur: (evt: React.FocusEvent<HTMLInputElement>) => void;
  restricted?: boolean;

  thumbnailRef: React.Ref<HTMLDivElement>;
  opacity: number;
}
