import { Link, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';

type NavigationLinkProps = {
  label: string;
  url: string;
};

const NavigationLink = (props: NavigationLinkProps) => (
  <Link
    as={RouterLink}
    to={props.url}
    css={css({
      transition: 'color',
      transitionDuration: theme => theme.speeds[2],
      display: 'inline-flex',
      alignItems: 'center',
      height: 10,
      color: 'grays.400',
      textDecoration: 'none',
      '&:hover': {
        color: 'white',
      },
    })}
    // @ts-ignore NavLink Prop
    exact
    // @ts-ignore NavLink Prop
    activeStyle={{ color: 'white' }}
  >
    {props.label}
  </Link>
);

type SettingsNavigationProps = {
  teamId: string;
  personal: boolean;
  activePlan: boolean;
  admin: boolean;
  stripe: boolean;
};

export const SettingNavigation = ({
  teamId,
  personal,
  activePlan,
  admin,
  stripe,
  ...props
}: SettingsNavigationProps) => {
  function renderUpgradeTab(): JSX.Element {
    if (!admin) return null;

    if (activePlan) {
      if (!stripe) return null;

      return (
        <NavigationLink
          url={dashboardUrls.subscription(teamId)}
          label="Subscription"
        />
      );
    }

    return <NavigationLink url="/pro" label="Upgrade" />;
  }

  return (
    <Stack direction="vertical" {...props}>
      <Stack
        css={css({
          width: '100%',
          borderStyle: 'solid',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: 'grays.500',
        })}
        gap={6}
      >
        <NavigationLink url={dashboardUrls.settings(teamId)} label="Account" />
        {!personal && (
          <NavigationLink
            url={dashboardUrls.registrySettings(teamId)}
            label="NPM Registry"
          />
        )}
        <NavigationLink
          url={dashboardUrls.permissionSettings(teamId)}
          label="Permissions"
        />
        {renderUpgradeTab()}
      </Stack>
    </Stack>
  );
};
