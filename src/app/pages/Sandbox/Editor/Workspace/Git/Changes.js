import React from 'react';
import styled, { css } from 'styled-components';

import Tooltip from 'app/components/Tooltip';
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

export default ({
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
