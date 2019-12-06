import styled, { css } from 'styled-components';
import Question from 'react-icons/lib/go/question';
import Private from 'react-icons/lib/md/lock';
import { UnlistedIcon } from './UnlistedIcon';

const iconStyles = css`
  opacity: 0.75;
`;

export const StyledUnlisted = styled(UnlistedIcon)`
  ${iconStyles}
`;
export const StyledPrivate = styled(Private)`
  ${iconStyles}
`;
export const Icon = styled(Question)`
  ${iconStyles}
`;
