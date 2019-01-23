import React from 'react';
import styled from 'styled-components';
import { formatKey } from 'common/utils/keybindings';

type Props = {
  bindings: Array<string>,
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
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
`;

export default ({ bindings }: Props) =>
  bindings.map(key => <Key key={key}>{formatKey(key)}</Key>);
