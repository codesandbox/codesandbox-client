type Suggestion = {
  title: string;
  action: () => void;
};

export class SandboxError extends Error {
  payload?: unknown;
  severity: 'error' | 'warning' = 'error';
  type: string = 'sandbox-error';
  suggestions: Suggestion[] = [];
}
