import React from 'react';
import styled, { css } from 'styled-components';

import TwitterIcon from 'react-icons/lib/fa/twitter';
import GithubIcon from 'react-icons/lib/fa/github';
import FeedbackIcon from 'react-icons/lib/go/comment-discussion';

import Relative from 'app/components/Relative';

const Container = styled.div`
  flex: 1;
  background-color: ${props => props.theme.background2};
  width: 100%;
  padding-bottom: 5rem;
`;

const Title = styled.h2`
  font-weight: 500;
  padding: 2rem;
  margin-top: 0 !important;
  font-size: 1.125rem;
  margin: 0;
  text-transform: uppercase;
`;

const ITEM_HEIGHT = 36;

const Item = styled.div`
  display: flex;
  align-items: center;
  transition: 0.3s ease all;
  position: absolute;
  top: ${props => props.top}px;
  left: 0;
  right: 0;
  height: ${ITEM_HEIGHT - 2}px;
  line-height: ${ITEM_HEIGHT - 2}px;
  margin: 1px 1rem;
  padding: 0 1rem;
  font-weight: 500;
  z-index: 1;
  cursor: pointer;
  border-radius: 4px;
  color: ${props => (props.selected ? 'white' : 'rgba(255, 255, 255, 0.4)')};

  ${props =>
    !props.selected &&
    css`
      &:hover {
        color: rgba(255, 255, 255, 0.6);
        background-color: ${styleProps => styleProps.theme.background};
      }
    `};
`;

const Selector = styled.div`
  transition: 0.2s ease all;
  position: absolute;
  top: 0px;
  left: 1rem;
  right: 1rem;
  height: ${ITEM_HEIGHT - 2}px;
  border-radius: 4px;
  z-index: 0;
  background-color: ${props => props.theme.secondary};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);

  transform: translateY(${props => props.offset + 1}px);
`;

const SocialIcons = styled.div`
  position: absolute;
  bottom: 2rem;
  margin-top: 2rem;
  margin-left: 2rem;
`;

const Icon = styled.a`
  display: inline-block;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.125rem;
  margin-right: 0.5rem;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;

type Props = {
  menuItems: Array<string>,
  itemIndex: number,
  setItem: (index: number) => void,
};

export default ({ menuItems, itemIndex, setItem }: Props) => (
  <Container>
    <Title>Preferences</Title>
    <Relative style={{ height: menuItems.length * ITEM_HEIGHT }}>
      {menuItems.map((item, i) => (
        <Item
          onClick={() => setItem(i)}
          key={item.title}
          selected={itemIndex === i}
          top={i * ITEM_HEIGHT}
        >
          <div style={{ height: ITEM_HEIGHT, marginRight: '0.5rem' }}>
            {item.icon}
          </div>
          {item.title}
        </Item>
      ))}
      <Selector offset={itemIndex * ITEM_HEIGHT} />
    </Relative>

    <SocialIcons>
      <Icon
        href="https://twitter.com/codesandboxapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TwitterIcon />
      </Icon>
      <Icon
        href="https://github.com/CompuIves/codesandbox-client"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubIcon />
      </Icon>
      <Icon
        href="https://discord.gg/FGeubVt"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FeedbackIcon />
      </Icon>
    </SocialIcons>
  </Container>
);
