import React from 'react';
import styled, { css } from 'styled-components';

import theme from 'common/theme';

import AddedIcon from 'react-icons/lib/go/diff-added';
import ModifiedIcon from 'react-icons/lib/go/diff-modified';
import RemovedIcon from 'react-icons/lib/go/diff-removed';

import Tooltip from 'common/components/Tooltip';
import EntryContainer from '../EntryContainer';

// border-bottom: 1px solid ${({ color }) => color.clearer(0.7)};
const ChangeContainer = styled.div`
  &:last-child {
    border-bottom: none;
  }
`;

const Entry = styled(EntryContainer)`
  display: flex;
  align-items: center;
  line-height: 1;

  ${({ hideColor }) =>
    hideColor &&
    css`
      background-color: transparent;
      padding-left: 0;
    `};

  svg {
    color: ${({ color }) => color};
    margin-right: 0.5rem;
  }
`;

const Changes = ({
  changes,
  color,
  Icon,
  title,
  hideColor,
}: {
  changes: Array<string>,
  color: Function,
  title: string,
  Icon: React.ReactElement,
  hideColor: boolean,
}) => (
  <div>
    {changes.sort().map(change => (
      <ChangeContainer key={change} color={color}>
        <Entry hideColor={hideColor} editing color={color}>
          <Tooltip title={title}>
            <Icon />
          </Tooltip>
          {change}
        </Entry>
      </ChangeContainer>
    ))}
  </div>
);

type ExtraProps = {
  changes: Array<string>,
  hideColor: boolean,
};

export const Added = ({ changes, hideColor }: ExtraProps) => (
  <Changes
    changes={changes}
    color={theme.green}
    Icon={AddedIcon}
    title="Added"
    hideColor={hideColor}
  />
);

export const Modified = ({ changes, hideColor }: ExtraProps) => (
  <Changes
    changes={changes}
    color={theme.secondary}
    Icon={ModifiedIcon}
    title="Modified"
    hideColor={hideColor}
  />
);

export const Deleted = ({ changes, hideColor }: ExtraProps) => (
  <Changes
    changes={changes}
    color={theme.red}
    Icon={RemovedIcon}
    title="Deleted"
    hideColor={hideColor}
  />
);

export default Changes;
