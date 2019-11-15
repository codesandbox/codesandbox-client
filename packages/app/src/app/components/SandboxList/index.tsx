import getIcon from '@codesandbox/common/lib/templates/icons';
import { SmallSandbox } from '@codesandbox/common/lib/types';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { format } from 'date-fns';
import React, { FunctionComponent } from 'react';
import EyeIcon from 'react-icons/lib/fa/eye';
import FullHeartIcon from 'react-icons/lib/fa/heart';
import ForkIcon from 'react-icons/lib/go/repo-forked';
import { Link } from 'react-router-dom';

import { DeleteSandboxButton } from '../DeleteSandboxButton';
import { PrivacyStatus } from '../PrivacyStatus';

import {
  Body,
  DeleteBody,
  HeaderRow,
  HeaderTitle,
  SandboxRow,
  StatBody,
  StatTitle,
  Table,
} from './elements';

type Props = {
  isCurrentUser: boolean;
  onDelete: (id: string) => void;
  sandboxes: SmallSandbox[];
};
export const SandboxList: FunctionComponent<Props> = ({
  sandboxes,
  isCurrentUser,
  onDelete,
}) => (
  <Table>
    <thead>
      <HeaderRow>
        <HeaderTitle>Title</HeaderTitle>

        <HeaderTitle>Created</HeaderTitle>

        <HeaderTitle>Updated</HeaderTitle>

        <StatTitle />

        <StatTitle>
          <FullHeartIcon />
        </StatTitle>

        <StatTitle>
          <EyeIcon />
        </StatTitle>

        <StatTitle>
          <ForkIcon />
        </StatTitle>

        {isCurrentUser && <HeaderTitle />}
      </HeaderRow>
    </thead>

    <Body>
      {sandboxes.map((sandbox, i) => {
        // TODO: investigate type mismatch between SmallSandbox and getIcon
        // @ts-ignore
        const Icon = getIcon(sandbox.template);

        return (
          <SandboxRow delay={i} key={sandbox.id}>
            <td>
              {/* We should probably use the Sandbox interface instead
                 * of SmallSandbox
                // @ts-ignore */}
              <Link to={sandboxUrl(sandbox)}>{getSandboxName(sandbox)}</Link>
              <PrivacyStatus privacy={sandbox.privacy} asIcon />
            </td>

            <td>{format(new Date(sandbox.insertedAt), 'MMM dd, yyyy')}</td>

            <td>{format(new Date(sandbox.updatedAt), 'MMM dd, yyyy')}</td>

            <StatBody>
              <Icon width={30} height={30} />
            </StatBody>

            <StatBody>{sandbox.likeCount}</StatBody>

            <StatBody>{sandbox.viewCount}</StatBody>

            <StatBody>{sandbox.forkCount}</StatBody>

            {isCurrentUser && onDelete ? (
              <DeleteBody>
                <DeleteSandboxButton id={sandbox.id} onDelete={onDelete} />
              </DeleteBody>
            ) : null}
          </SandboxRow>
        );
      })}
    </Body>
  </Table>
);
