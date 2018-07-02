import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { patronUrl, dashboardUrl } from 'common/utils/url-generator';

import PlusIcon from 'react-icons/lib/go/plus';
import BellIcon from 'react-icons/lib/md/notifications';
import Row from 'common/components/flex/Row';
import Tooltip from 'common/components/Tooltip';
import PatronBadge from '-!svg-react-loader!common/utils/badges/svg/patron-4.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import HeaderSearchBar from 'app/components/HeaderSearchBar';
import InfoIcon from 'app/pages/Sandbox/Editor/Navigation/InfoIcon';
import OverlayComponent from 'app/components/Overlay';
import Notifications from './Notifications';

import SignInButton from '../SignInButton';
import UserMenu from '../UserMenu';
import {
  LogoWithBorder,
  Border,
  Title,
  Actions,
  Action,
  UnreadIcon,
} from './elements';

function Navigation({ signals, store, title }) {
  const { isLoggedIn, isPatron, user } = store;

  return (
    <Row justifyContent="space-between">
      <Row>
        <a href="/">
          <LogoWithBorder height={40} width={40} />
        </a>
        <Border width={1} size={500} />
        <Title>{title}</Title>
      </Row>
      <Row>
        <Actions>
          <Action>
            <HeaderSearchBar />
          </Action>
          {!isPatron && (
            <Action>
              <Tooltip position="bottom" title="Support CodeSandbox">
                <Link to={patronUrl()}>
                  <PatronBadge width={40} height={40} />
                </Link>
              </Tooltip>
            </Action>
          )}

          <Action
            style={{ fontSize: '1.125rem' }}
            onClick={() =>
              signals.modalOpened({
                modal: 'newSandbox',
              })
            }
          >
            <Tooltip position="bottom" title="New Sandbox">
              <PlusIcon height={35} />
            </Tooltip>
          </Action>

          {user && (
            <Action style={{ fontSize: '1.125rem' }}>
              <Tooltip position="bottom" title="Dashboard">
                <Link style={{ color: 'white' }} to={dashboardUrl()}>
                  <InfoIcon height={35} />
                </Link>
              </Tooltip>
            </Action>
          )}

          {user && (
            <OverlayComponent
              isOpen={store.userNotifications.notificationsOpened}
              Overlay={Notifications}
              onOpen={signals.userNotifications.notificationsOpened}
              onClose={signals.userNotifications.notificationsClosed}
              event="Notifications"
            >
              {open => (
                <Action
                  style={{ position: 'relative', fontSize: '1.25rem' }}
                  onClick={open}
                >
                  <BellIcon height={35} />
                  {store.userNotifications.unreadCount > 0 && (
                    <UnreadIcon count={store.userNotifications.unreadCount} />
                  )}
                </Action>
              )}
            </OverlayComponent>
          )}
        </Actions>

        {isLoggedIn ? <UserMenu /> : <SignInButton />}
      </Row>
    </Row>
  );
}
export default inject('store', 'signals')(observer(Navigation));
