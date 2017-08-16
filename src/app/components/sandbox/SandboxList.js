// @flow
import * as React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';

import PrivacyStatus from 'app/components/sandbox/PrivacyStatus';
import delayEffect from 'app/utils/animation/delay-effect';
import { sandboxUrl } from 'app/utils/url-generator';

import type { SmallSandbox } from 'common/types';

import FullHeartIcon from 'react-icons/lib/fa/heart';
import EyeIcon from 'react-icons/lib/fa/eye';
import ForkIcon from 'react-icons/lib/go/repo-forked';

import DeleteSandboxButton from './DeleteSandboxButton';

const HeaderTitle = styled.th`
  font-weight: 400;
  text-align: left;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
`;

const Table = styled.table`
  ${delayEffect(0.2)};
  width: 100%;
  border-spacing: 0;
  margin-bottom: 2rem;
`;

const StatTitle = styled(HeaderTitle)`
  width: 2rem;
  text-align: center;
`;

const StatBody = styled.td`
  width: 2rem;
  text-align: center;
`;

const Body = styled.tbody`
  margin-top: 3rem;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.7);
  background: ${props => props.theme.background2};

  td {
    border: none;
    padding: 1rem 0.5rem;
    margin: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
`;

const SandboxRow = styled.tr`
  transition: 0.3s ease all;
  ${props => delayEffect(0.25 + props.index * 0.05, false)};
  border: none;
  margin: 0;

  &:hover {
    background-color: ${props => props.theme.primary.clearer(0.9)};
    color: rgba(255, 255, 255, 0.9);
  }
`;

type Props = {
  isCurrentUser: boolean,
  sandboxes: Array<SmallSandbox>,
  onDelete: Function,
};

export default ({ sandboxes, isCurrentUser, onDelete }: Props) =>
  <Table>
    <thead>
      <tr style={{ height: '3rem' }}>
        <HeaderTitle>Title</HeaderTitle>
        <HeaderTitle>Created</HeaderTitle>
        <HeaderTitle>Updated</HeaderTitle>
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
      </tr>
    </thead>
    <Body>
      {sandboxes.map((s, i) =>
        <SandboxRow index={i} key={s.id}>
          <td>
            <Link to={sandboxUrl(s)}>
              {s.title || s.id}
            </Link>
            <PrivacyStatus privacy={s.privacy} asIcon />
          </td>
          <td>
            {moment(s.insertedAt).format('ll')}
          </td>
          <td>
            {moment(s.updatedAt).format('ll')}
          </td>
          <StatBody>
            {s.likeCount}
          </StatBody>
          <StatBody>
            {s.viewCount}
          </StatBody>
          <StatBody>
            {s.forkCount}
          </StatBody>
          {isCurrentUser &&
            <StatBody style={{ padding: '0.55rem 0.5rem', cursor: 'pointer' }}>
              <DeleteSandboxButton id={s.id} onDelete={onDelete} />
            </StatBody>}
        </SandboxRow>,
      )}
    </Body>
  </Table>;
