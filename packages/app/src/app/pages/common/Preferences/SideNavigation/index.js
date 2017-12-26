import React from 'react';

import TwitterIcon from 'react-icons/lib/fa/twitter';
import GithubIcon from 'react-icons/lib/fa/github';
import FeedbackIcon from 'react-icons/lib/go/comment-discussion';
import Relative from 'common/components/Relative';

import {
  Container,
  Title,
  ITEM_HEIGHT,
  Item,
  Selector,
  SocialIcons,
  Icon,
} from './elements';

function SideNavigation({ menuItems, itemIndex, setItem }) {
  return (
    <Container>
      <Title>Preferences</Title>
      <Relative style={{ height: menuItems.length * ITEM_HEIGHT }}>
        {menuItems.map((item, i) => (
          <Item
            onClick={() => setItem({ itemIndex: i })}
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
}

export default SideNavigation;
