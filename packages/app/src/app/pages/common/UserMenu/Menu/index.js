import React from 'react';
import { Link } from 'react-router-dom';

import UserIcon from 'react-icons/lib/ti/user';
import ExitIcon from 'react-icons/lib/md/exit-to-app';
import FolderIcon from 'react-icons/lib/md/folder';
import SettingsIcon from 'react-icons/lib/md/settings';
import BookIcon from 'react-icons/lib/md/library-books';

import {
  profileUrl,
  patronUrl,
  curatorUrl,
  dashboardUrl,
} from 'common/lib/utils/url-generator';
import PatronBadge from 'common/lib/utils/badges/PatronBadge';
import InfoIcon from 'app/pages/Sandbox/Editor/Navigation/InfoIcon';
import track from 'common/lib/utils/analytics';

import { Container, Item, Icon, Separator } from './elements';
import FeedbackIcon from './FeedbackIcon';

export default class Menu extends React.PureComponent {
  componentDidMount() {
    track('User Menu Open');
  }

  render() {
    const {
      username,
      curator,
      openPreferences,
      openStorageManagement,
      openFeedback,
      signOut,
    } = this.props;

    return (
      <Container>
        <Item as={Link} to={profileUrl(username)}>
          <Icon>
            <UserIcon />
          </Icon>
          My Profile
        </Item>

        <Separator />

        <Item as={Link} to={dashboardUrl()}>
          <Icon>
            <InfoIcon />
          </Icon>
          Dashboard
        </Item>

        <Item as="a" href="/docs">
          <Icon>
            <BookIcon />
          </Icon>
          Documentation
        </Item>

        {curator && (
          <Item as={Link} to={curatorUrl()}>
            <Icon>
              <span css={{ width: 14 }} role="img" aria-label="Star">
                ✨
              </span>
            </Icon>
            Curator Dashboard
          </Item>
        )}

        <Item as={Link} to={patronUrl()}>
          <Icon>
            <PatronBadge style={{ width: 24, margin: '-6px -5px' }} size={24} />
          </Icon>
          Patron Page
        </Item>

        <Separator />

        <Item onClick={openStorageManagement}>
          <Icon>
            <FolderIcon />
          </Icon>
          Storage Management
        </Item>

        <Item onClick={openPreferences}>
          <Icon>
            <SettingsIcon />
          </Icon>
          Preferences
        </Item>

        <Separator />

        <Item onClick={openFeedback}>
          <Icon>
            <FeedbackIcon />
          </Icon>
          Submit Feedback
        </Item>

        <Separator />

        <Item onClick={signOut}>
          <Icon>
            <ExitIcon />
          </Icon>
          Sign out
        </Item>
      </Container>
    );
  }
}
