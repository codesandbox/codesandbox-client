import styled from 'styled-components';
import { default as BaseProgressButton } from '@codesandbox/common/lib/components/ProgressButton';
import BaseForkIcon from 'react-icons/lib/go/repo-forked';

export const ProgressButton = styled(BaseProgressButton)`
  font-size: 0.75rem;
`;

export const ForkIcon = styled(BaseForkIcon)`
  margin-right: 0.5rem;
`;
