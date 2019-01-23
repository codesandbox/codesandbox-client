import React from 'react';
import { inject, observer } from 'mobx-react';

import AppearanceIcon from 'react-icons/lib/md/color-lens';
import CodeIcon from 'react-icons/lib/fa/code';
import CreditCardIcon from 'react-icons/lib/md/credit-card';
import BrowserIcon from 'react-icons/lib/go/browser';
import StarIcon from 'react-icons/lib/go/star';
import FlaskIcon from 'react-icons/lib/fa/flask';
import CodeFormatIcon from 'react-icons/lib/fa/dedent';
import IntegrationIcon from 'react-icons/lib/md/device-hub';
import KeyboardIcon from 'react-icons/lib/go/keyboard';

import SideNavigation from './SideNavigation';

import Appearance from './Appearance';
import EditorSettings from './EditorPageSettings/EditorSettings';
import PreviewSettings from './EditorPageSettings/PreviewSettings';
import CodeFormatting from './CodeFormatting';
import PaymentInfo from './PaymentInfo';
import Integrations from './Integrations';
import Badges from './Badges';
import Experiments from './Experiments';
import KeyMapping from './KeyMapping';

import { Container, ContentContainer } from './elements';

class PreferencesModal extends React.Component {
  getItems = () => {
    const hasSubscription = this.props.store.isPatron;
    const signedIn = this.props.store.isLoggedIn;

    return [
      {
        id: 'appearance',
        title: 'Appearance',
        icon: <AppearanceIcon />,
        content: <Appearance />,
      },
      {
        id: 'editor',
        title: 'Editor',
        icon: <CodeIcon />,
        content: <EditorSettings />,
      },
      {
        id: 'prettierSettings',
        title: 'Prettier Settings',
        icon: <CodeFormatIcon />,
        content: <CodeFormatting />,
      },
      {
        id: 'preview',
        title: 'Preview',
        icon: <BrowserIcon />,
        content: <PreviewSettings />,
      },
      {
        id: 'keybindings',
        title: 'Key Bindings',
        icon: <KeyboardIcon />,
        content: <KeyMapping />,
      },
      signedIn && {
        id: 'integrations',
        title: 'Integrations',
        icon: <IntegrationIcon />,
        content: <Integrations />,
      },
      hasSubscription && {
        id: 'paymentInfo',
        title: 'Payment Info',
        icon: <CreditCardIcon />,
        content: <PaymentInfo />,
      },
      hasSubscription && {
        id: 'badges',
        title: 'Badges',
        icon: <StarIcon />,
        content: <Badges />,
      },
      {
        id: 'experiments',
        title: 'Experiments',
        icon: <FlaskIcon />,
        content: <Experiments />,
      },
    ].filter(x => x);
  };

  render() {
    const items = this.getItems();
    const item = items.find(
      currentItem => currentItem.id === this.props.store.preferences.itemId
    );

    return (
      <Container>
        <SideNavigation
          itemId={this.props.store.preferences.itemId}
          menuItems={items}
          setItem={this.props.signals.preferences.itemIdChanged}
        />
        <ContentContainer>{item.content}</ContentContainer>
      </Container>
    );
  }
}

export default inject('store', 'signals')(observer(PreferencesModal));
