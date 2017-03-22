import React from 'react';
import styled from 'styled-components';

import Button from '../../../../../../../components/buttons/Button';

const Container = styled.div`
  display: flex;
  background-color: ${props => props.theme.background};
  box-shadow: 0 3px 3px ${props => props.theme.background2};
  color: ${props => props.theme.white};
  padding: 0.5rem 1rem;
  flex: 0 0 3rem;
  box-sizing: border-box;
  justify-content: space-between;
  vertical-align: middle;
  align-items: center;
`;

const Path = styled.span`
  color: ${props => props.theme.background.lighten(1.25)};
  padding-right: 0.1rem;
`;

const Buttons = styled.div`
  button {
    width: 6rem;
    margin-left: 1rem;
  }
`;

type Props = {
  title: string,
  path: string,
  saveComponent: ?() => void,
  prettify: Function,
};

export default ({ path, title, saveComponent, prettify }: Props) => (
  <Container>
    <div>
      <Path>{path}</Path>
      {title}
    </div>

    <Buttons>
      <Button onClick={prettify} small>
        Prettify
      </Button>
      <Button disabled={!saveComponent} onClick={saveComponent} small>
        Save
      </Button>
    </Buttons>
  </Container>
);
