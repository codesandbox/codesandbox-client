import { Button } from '@codesandbox/common/lib/components/Button';
import PowerIconBase from 'react-icons/lib/md/power-settings-new';
import styled from 'styled-components';

import { SubTitle as SubTitleBase } from '../elements';

export const ActionButton = styled(Button).attrs({
  block: true,
  small: true,
})`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PowerIcon = styled(PowerIconBase)`
  font-size: 1.125em;
  margin-right: 0.25rem;
`;

export const SubTitle = styled(SubTitleBase)`
  margin-bottom: 0.5rem;
`;
