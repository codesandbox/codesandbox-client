import React from 'react';
import styled from 'styled-components';

import getBadge from 'common/utils/badges';

import MaxWidth from 'common/components/flex/MaxWidth';
import Centered from 'common/components/flex/Centered';

import media from '../../../utils/media';

import { Heading, SubHeading } from '../../../components/style';

const Container = styled.div`
  background-color: ${props => props.theme.primary};
`;

const Header = Heading.extend`
  color: ${props => props.theme.primaryText};
`;

const Text = SubHeading.extend`
  color: rgba(0, 0, 0, 0.5);
  text-shadow: none;
`;

const Badge = styled.div`
  position: relative;
  margin-top: 2rem;
`;

const Button = styled.a`
  transition: 0.3s ease all;
  color: white;

  /* background-color: rgba(254, 143, 144, 1); */
  background-color: ${props => props.theme.secondary};
  text-decoration: none;
  padding: 0.5rem 0;
  text-align: center;
  width: 200px;
  border-radius: 4px;
  margin-bottom: 6rem;

  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);

  &:hover {
    box-shadow: 0 7px 12px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default () => (
  <Container>
    <MaxWidth>
      <Centered horizontal>
        <Header>Become a Patron</Header>
        <Text>
          You can support our development by becoming a Patron and paying a
          monthly amount of your choice. As a Patron you get less limits and
          extra features, like private sandboxes. There are more patron features
          coming.
        </Text>

        <Content>
          <Badge>
            <img width={200} src={getBadge('patron_4')} alt="Patron IV" />
          </Badge>
          <Button target="_blank" rel="noreferrer noopener" href="/patron">
            Open Patron Page
          </Button>
        </Content>
      </Centered>
    </MaxWidth>
  </Container>
);
