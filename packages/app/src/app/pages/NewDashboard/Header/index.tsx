import React, { useState } from 'react';
import { useOvermind } from 'app/overmind';
import { UserMenu } from 'app/pages/common/UserMenu';
import {
  Stack,
  Input,
  Button,
  Icon,
  IconButton,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { withRouter } from 'react-router-dom';

export const HeaderComponent = ({ history }) => {
  const [value, setValue] = useState();
  const {
    actions: { modalOpened },
  } = useOvermind();

  const searchQuery = new URLSearchParams(window.location.search).get('query');

  const onChange = e => {
    setValue(e.target.value);
    if (!e.target.value) {
      history.push(`/new-dashboard/all`);
    }

    if (e.target.value.length >= 2) {
      history.push(`/new-dashboard/search?query=${e.target.value}`);
    }
  };

  return (
    <Stack
      as="header"
      justify="space-between"
      align="center"
      paddingX={4}
      css={css({
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
        height: 12,
        backgroundColor: 'titleBar.activeBackground',
        color: 'titleBar.activeForeground',
        borderBottom: '1px solid',
        borderColor: 'titleBar.border',
      })}
    >
      <IconButton name="menu" size={18} title="Menu" />
      <Input
        value={value || searchQuery || ''}
        onChange={onChange}
        onKeyDown={e => {
          if (e.key === 'Enter' && value) {
            history.push(`/new-dashboard/search?query=${e.target.value}`);
          }
        }}
        type="text"
        placeholder="Search all sandboxes"
        css={css({ maxWidth: 480, display: ['none', 'none', 'block'] })}
      />
      <Stack align="center" gap={2}>
        <Button
          variant="primary"
          css={css({ width: 'auto', paddingX: 3 })}
          onClick={() => modalOpened({ modal: 'newSandbox' })}
        >
          Create Sandbox
        </Button>
        <Button variant="secondary" css={css({ size: 26 })}>
          <Icon name="bell" size={11} title="Notifications" />
        </Button>
        <UserMenu>
          <Button variant="secondary" css={css({ size: 26 })}>
            <Icon name="more" size={12} title="User actions" />
          </Button>
        </UserMenu>
      </Stack>
    </Stack>
  );
};

export const Header = withRouter(HeaderComponent);
