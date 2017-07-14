import React from 'react';
import styled from 'styled-components';

import UserIcon from 'react-icons/lib/ti/user';
import CodeIcon from 'react-icons/lib/md/code';
import CreditCardIcon from 'react-icons/lib/md/credit-card';

import SideNavigation from './SideNavigation';

import EditorSettings from './EditorSettings';
import PaymentInfo from './PaymentInfo';
import UserSettings from './UserSettings';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.background};
  color: rgba(255, 255, 255, 0.8);
`;

const ContentContainer = styled.div`
  flex: 2;
  padding: 2rem 1rem;
`;

const MENU_ITEMS = [
  {
    title: 'My Account',
    icon: <UserIcon />,
    content: <UserSettings />,
  },
  {
    title: 'Editor',
    icon: <CodeIcon />,
    content: <EditorSettings />,
  },
  {
    title: 'Payment Info',
    icon: <CreditCardIcon />,
    content: <PaymentInfo />,
  },
];

export default class Preferences extends React.PureComponent {
  state = {
    itemIndex: 0,
  };

  setItem = (index: number) => {
    this.setState({ itemIndex: index });
  };

  render() {
    return (
      <Container>
        <SideNavigation
          itemIndex={this.state.itemIndex}
          menuItems={MENU_ITEMS}
          setItem={this.setItem}
        />
        <ContentContainer>
          {MENU_ITEMS[this.state.itemIndex].content}
        </ContentContainer>
      </Container>
    );
  }
}
