import { Sandbox } from '../types';

export const getSandboxName = ({
  alias,
  id,
  title,
}: Pick<Sandbox, 'alias' | 'id' | 'title'>) => title || alias || id;
