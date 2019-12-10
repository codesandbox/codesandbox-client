import { Sandbox } from '../types';

export const getSandboxName = ({
  alias,
  id,
  title,
}: Partial<Pick<Sandbox, 'alias'>> & Pick<Sandbox, 'id' | 'title'>) =>
  title || alias || id;
