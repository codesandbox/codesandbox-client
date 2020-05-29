import { GoQuestion } from 'react-icons/go';
import { MdLock } from 'react-icons/md';
import styled, { css } from 'styled-components';

import { UnlistedIcon } from './UnlistedIcon';

const iconStyles = css`
  opacity: 0.75;
`;

export const StyledUnlisted = styled(UnlistedIcon)`
  ${iconStyles}
`;
export const StyledPrivate = styled(MdLock)`
  ${iconStyles}
`;
export const Icon = styled(GoQuestion)`
  ${iconStyles}
`;
