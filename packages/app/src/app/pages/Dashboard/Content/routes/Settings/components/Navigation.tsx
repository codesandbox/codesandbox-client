import { Link, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';

type NavigationLinkProps = {
  url?: string;
  onClick?: () => void;
};

const NavigationLink: React.FC<NavigationLinkProps> = ({
  url,
  onClick,
  children,
}) => {
  const as = url ? RouterLink : 'button';

  return (
    <Link
      as={as}
      to={url}
      css={css({
        transition: 'color',
        transitionDuration: theme => theme.speeds[2],
        display: 'inline-flex',
        alignItems: 'center',
        height: 10,
        color: 'grays.400',
        textDecoration: 'none',
        background: 'none',
        border: 0,
        cursor: 'pointer',
        font: 'inherit',
        '&:hover': {
          color: 'white',
        },
      })}
      // @ts-ignore NavLink Prop
      exact
      // @ts-ignore NavLink Prop
      activeStyle={{ color: 'white' }}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

type SettingsNavigationProps = {
  teamId: string;
};

export const SettingNavigation = ({ teamId }: SettingsNavigationProps) => {
  return (
    <Stack direction="vertical">
      <Stack
        css={css({
          width: '100%',
          borderStyle: 'solid',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: 'transparent',
        })}
        gap={6}
      >
        <NavigationLink url={dashboardUrls.settings(teamId)}>
          Account
        </NavigationLink>

        <NavigationLink url={dashboardUrls.registrySettings(teamId)}>
          NPM Registry
        </NavigationLink>

        <NavigationLink url={dashboardUrls.permissionSettings(teamId)}>
          Permissions
        </NavigationLink>
      </Stack>
    </Stack>
  );
};
