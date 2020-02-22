import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Select, Stack } from '@codesandbox/components';
import { Authorization } from 'app/graphql/types';

interface IPermissionSelectProps extends React.ComponentProps<typeof Select> {
  additionalOptions?: { value: string; label: string }[];
  permissions?: Authorization[];
  pretext?: string;
}

export const GhostSelect = styled(Select).attrs({ variant: 'link' })`
  display: block;
`;

const authToName = {
  [Authorization.WriteCode]: 'Can Edit',
  [Authorization.Comment]: 'Can Comment',
  [Authorization.None]: 'No Access',
  [Authorization.Read]: 'Can View',
  [Authorization.WriteProject]: 'Edit Sandbox Info',
};

export const SELECT_WIDTH = 85;
export const PermissionSelect = ({
  additionalOptions = [],
  permissions = [Authorization.WriteCode, Authorization.Read],
  ...props
}: IPermissionSelectProps) => (
  <Stack align="center">
    <GhostSelect css={css({ width: SELECT_WIDTH })} {...props}>
      {permissions.map(auth => (
        <option key={auth} value={auth}>
          {authToName[auth]}
        </option>
      ))}

      {additionalOptions.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </GhostSelect>
  </Stack>
);
