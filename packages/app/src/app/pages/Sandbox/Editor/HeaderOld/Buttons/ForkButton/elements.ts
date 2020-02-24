import { default as ProgressButtonBase } from '@codesandbox/common/lib/components/ProgressButton';
import BaseForkIcon from 'react-icons/lib/go/repo-forked';
import styled from 'styled-components';

export const ProgressButton = styled(ProgressButtonBase)`
  font-size: 0.75rem;
`;

export const ForkIcon = styled(BaseForkIcon)`
  margin-right: 0.5rem;
`;
