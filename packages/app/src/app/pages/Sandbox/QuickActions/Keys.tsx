import * as React from 'react';
import styled from 'app/styled-components';
import { formatKey } from 'common/utils/keybindings';

type Props = {
  bindings: string[]
};

const Key = styled.div`
  padding: 0.25rem 0.3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.background2};
  border-radius: 3px;
  margin: 0 1px;
  font-size: 0.75rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
`;

export default ({ bindings }: Props) =>
<React.Fragment>{bindings.map(key => <Key key={key}>{formatKey(key)}</Key>)}</React.Fragment>
