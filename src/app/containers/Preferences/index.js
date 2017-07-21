import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { currentUserSelector } from 'app/store/user/selectors';
import type { CurrentUser } from 'common/types';

import CodeIcon from 'react-icons/lib/md/code';
import CreditCardIcon from 'react-icons/lib/md/credit-card';
import BrowserIcon from 'react-icons/lib/go/browser';
import StarIcon from 'react-icons/lib/go/star';

import SideNavigation from './SideNavigation';

import EditorSettings from './EditorPageSettings/EditorSettings';
import PreviewSettings from './EditorPageSettings/PreviewSettings';
import PaymentInfo from './PaymentInfo';
import Badges from './Badges';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.background};
  color: rgba(255, 255, 255, 0.8);
`;

const ContentContainer = styled.div`
  flex: 2;
  padding: 2rem;
`;

type Props = {
  user: CurrentUser,
};

const mapStateToProps = state => ({
  user: currentUserSelector(state),
});
class Preferences extends React.PureComponent {
  props: Props;

  state = {
    itemIndex: 0,
  };

  setItem = (index: number) => {
    this.setState({ itemIndex: index });
  };

  getItems = () => {
    const hasSubscription = Boolean(this.props.user.subscription);
    return [
      {
        title: 'Editor',
        icon: <CodeIcon />,
        content: <EditorSettings />,
      },
      {
        title: 'Preview',
        icon: <BrowserIcon />,
        content: <PreviewSettings />,
      },
      hasSubscription && {
        title: 'Payment Info',
        icon: <CreditCardIcon />,
        content: <PaymentInfo />,
      },
      hasSubscription && {
        title: 'Badges',
        icon: <StarIcon />,
        content: <Badges />,
      },
    ].filter(x => x);
  };

  render() {
    return (
      <Container>
        <SideNavigation
          itemIndex={this.state.itemIndex}
          menuItems={this.getItems()}
          setItem={this.setItem}
        />
        <ContentContainer>
          {this.getItems()[this.state.itemIndex].content}
        </ContentContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(Preferences);
