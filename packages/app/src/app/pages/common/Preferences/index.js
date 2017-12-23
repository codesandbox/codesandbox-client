import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
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

export default inject('store', 'signals')(
  observer(
    class Preferences extends React.Component {
      constructor(props) {
        super(props);
        if (props.initialPane) {
          const index = this.getItems()
            .map(x => x.title)
            .indexOf(props.initialPane);

          props.signals.editor.preferences.itemIndexChanged({ index });
        }
      }

      getItems = () => {
        const hasSubscription = Boolean(this.props.store.user.subscription);
        const signedIn = Boolean(this.props.store.isLoggedIn);

        return [
          {
            title: 'Editor',
            icon: <CodeIcon />,
            content: <EditorSettings />,
          },
          {
            title: 'Prettier Settings',
            icon: <CodeFormatIcon />,
            content: <CodeFormatting />,
          },
          {
            title: 'Preview',
            icon: <BrowserIcon />,
            content: <PreviewSettings />,
          },
          {
            title: 'Key Bindings',
            icon: <KeyboardIcon />,
            content: <KeyMapping />,
          },
          signedIn && {
            title: 'Integrations',
            icon: <IntegrationIcon />,
            content: <Integrations />,
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
          {
            title: 'Experiments',
            icon: <FlaskIcon />,
            content: <Experiments />,
          },
        ].filter(x => x);
      };

      render() {
        return (
          <Container>
            <SideNavigation
              itemIndex={this.props.store.editor.preferences.itemIndex}
              menuItems={this.getItems()}
              setItem={this.props.signals.editor.preferences.itemIndexChanged}
            />
            <ContentContainer>
              {
                this.getItems()[this.props.store.editor.preferences.itemIndex]
                  .content
              }
            </ContentContainer>
          </Container>
        );
      }
    }
  )
);
