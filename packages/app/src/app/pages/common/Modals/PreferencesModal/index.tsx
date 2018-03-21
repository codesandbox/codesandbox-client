import * as React from 'react';
import { connect } from 'app/fluent';

import CodeIcon from 'react-icons/lib/fa/code';
import CreditCardIcon from 'react-icons/lib/md/credit-card';
import BrowserIcon from 'react-icons/lib/go/browser';
import StarIcon from 'react-icons/lib/go/star';
import FlaskIcon from 'react-icons/lib/fa/flask';
import CodeFormatIcon from 'react-icons/lib/fa/dedent';
import IntegrationIcon from 'react-icons/lib/md/device-hub';
import KeyboardIcon from 'react-icons/lib/go/keyboard';

import SideNavigation from './SideNavigation';

import EditorSettings from './EditorPageSettings/EditorSettings';
import PreviewSettings from './EditorPageSettings/PreviewSettings';
import CodeFormatting from './CodeFormatting';
import PaymentInfo from './PaymentInfo';
import Integrations from './Integrations';
import Badges from './Badges';
import Experiments from './Experiments';
import KeyMapping from './KeyMapping';

import { Container, ContentContainer } from './elements';

export default connect()
  .with(({ state, signals }) => ({
    isPatron: state.isPatron,
    isLoggedIn: state.isLoggedIn,
    itemId: state.preferences.itemId,
    itemIdChanged: signals.preferences.itemIdChanged
  }))
  .toClass(props =>
    class PreferencesModal extends React.Component<typeof props> {
      getItems = () => {
        const hasSubscription = this.props.isPatron;
        const signedIn = this.props.isLoggedIn;

        return [
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
          currentItem => currentItem.id === this.props.itemId
        );

        return (
          <Container>
            <SideNavigation
              itemId={this.props.itemId}
              menuItems={items}
              setItem={this.props.itemIdChanged}
            />
            <ContentContainer>{item.content}</ContentContainer>
          </Container>
        );
      }
    }
  )
