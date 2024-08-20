import { DashboardSandbox, DashboardTemplate } from '../../types';

export interface SandboxItemComponentProps {
  noDrag?: boolean;
  sandbox: DashboardSandbox['sandbox'] | DashboardTemplate['sandbox'];
  sandboxTitle: string;
  sandboxLocation?: string;
  timeAgo: string;
  viewCount: number | string;
  TemplateIcon: React.FC<{
    width: string;
    height: string;
    style?: React.CSSProperties;
  }>;
  PrivacyIcon: React.FC;
  screenshotUrl: string | null;
  restricted: boolean;
  username: string | null;
  interaction: 'button' | 'link';
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

  thumbnailRef: React.Ref<HTMLDivElement>;
  isDragging: boolean;

  'data-selection-id'?: string;
}
