import * as React from 'react';

import Relative from 'common/components/Relative';
import SocialInfo from 'app/components/SocialInfo';

import {
  Container,
  SocialContainer,
  Title,
  ITEM_HEIGHT,
  Item,
  Selector,
} from './elements';

export type Item = {
  id: string
  title: string
  icon: React.ReactNode
}

export type Props = {
  menuItems: Item[]
  itemId: string
  setItem: (props: { itemId: string }) => void
}

const SideNavigation: React.SFC<Props> = ({ menuItems, itemId, setItem }) => {
  const itemIndex = menuItems.findIndex(item => item.id === itemId);

  return (
    <Container>
      <Title>Preferences</Title>
      <Relative style={{ height: menuItems.length * ITEM_HEIGHT }}>
        {menuItems.map((item, i) => (
          <Item
            onClick={() => setItem({ itemId: item.id })}
            key={item.title}
            selected={itemId === item.id}
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
      <SocialContainer>
        <SocialInfo />
      </SocialContainer>
    </Container>
  );
}

export default SideNavigation;
