import getIcon from '@codesandbox/common/es/templates/icons';
import { SmallSandbox } from '@codesandbox/common/es/types';
import { getSandboxName } from '@codesandbox/common/es/utils/get-sandbox-name';
import { sandboxUrl } from '@codesandbox/common/es/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { format } from 'date-fns';
import React, { FunctionComponent } from 'react';
import { FaEye, FaHeart } from 'react-icons/fa';
import { GoRepoForked } from 'react-icons/go';
import { Link } from 'react-router-dom';

import { PrivacyStatus } from '../PrivacyStatus';
import { DeleteSandboxButton } from './DeleteSandboxButton';
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

type SandboxSource = 'currentLikedSandboxes' | 'currentSandboxes';
type Props = {
  sandboxes: SmallSandbox[];
  source: SandboxSource;
};
export const SandboxList: FunctionComponent<Props> = ({
  sandboxes,
  source,
}) => {
  const {
    state: {
      profile: { isProfileCurrentUser },
    },
  } = useOvermind();
  const showDeleteButton =
    isProfileCurrentUser && source === 'currentSandboxes';

  return (
    <Table>
      <thead>
        <HeaderRow>
          <HeaderTitle>Title</HeaderTitle>

          <HeaderTitle>Created</HeaderTitle>

          <HeaderTitle>Updated</HeaderTitle>

          <StatTitle />

          <StatTitle>
            <FaHeart />
          </StatTitle>

          <StatTitle>
            <FaEye />
          </StatTitle>

          <StatTitle>
            <GoRepoForked />
          </StatTitle>

          {showDeleteButton ? <HeaderTitle /> : null}
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

              {showDeleteButton ? (
                <DeleteBody>
                  <DeleteSandboxButton id={sandbox.id} />
                </DeleteBody>
              ) : null}
            </SandboxRow>
          );
        })}
      </Body>
    </Table>
  );
};
