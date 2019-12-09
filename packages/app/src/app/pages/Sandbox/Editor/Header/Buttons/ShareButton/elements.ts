import styled from 'styled-components';
import BaseShareIcon from 'react-icons/lib/md/share';
import { Button as BaseButton } from '@codesandbox/common/lib/components/Button';

export const Button = styled(BaseButton)`
  font-size: 0.75rem;
  margin: 0 1rem;
`;

export const ShareIcon = styled(BaseShareIcon)`
  margin-right: 0.5rem;
`;
