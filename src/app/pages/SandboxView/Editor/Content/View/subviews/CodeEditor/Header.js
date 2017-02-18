import React from 'react';
import styled from 'styled-components';

import SaveIcon from 'react-icons/lib/md/save';
import Button from '../../../../../../../components/buttons/Button';

const Container = styled.div`
  display: flex;
  background-color: ${props => props.theme.background};
  box-shadow: 0 3px 3px ${props => props.theme.background2};
  color: ${props => props.theme.white};
  padding: 0.5rem 1rem;
  height: 3rem;
  box-sizing: border-box;
  justify-content: space-between;
  vertical-align: middle;
  align-items: center;
`;

const Path = styled.span`
  color: ${props => props.theme.background.lighten(1.25)};
  padding-right: 0.1rem;
`;


type Props = {
  title: string;
  path: string;
  saveComponent?: () => void;
};

export default ({ path, title, saveComponent }: Props) => (
  <Container>

    <div>
      <Path>{path}</Path>
      {title}
    </div>

    <Button disabled={!saveComponent} onClick={saveComponent} small>
      <SaveIcon />
      &nbsp;Save
    </Button>
  </Container>
);
