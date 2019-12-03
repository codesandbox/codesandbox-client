import TeamIconBase from 'react-icons/lib/md/people';
import styled from 'styled-components';

import { Item as ItemBase } from '../elements';

export const Item = styled(ItemBase)`
  color: white;
  display: flex;
`;

export const TeamIcon = styled(TeamIconBase)`
  font-size: 1.125em;
  margin-right: 0.5rem;
`;
