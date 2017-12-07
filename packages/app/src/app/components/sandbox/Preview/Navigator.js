import React from 'react';
import styled from 'styled-components';

import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';
import RefreshIcon from 'react-icons/lib/md/refresh';
import ExternalIcon from 'react-icons/lib/md/open-in-new';

import Switch from 'app/components/Switch';
import Tooltip from 'common/components/Tooltip';

import AddressBar from './AddressBar';

const Container = styled.div`
  display: flex;
  background-color: #f2f2f2;
  padding: 0.5rem;
  align-items: center;
  line-height: 1;
  box-shadow: 0 1px 3px #ddd;
  height: 2.5rem;
  min-height: 2.5rem;
  box-sizing: border-box;
`;

const Icons = styled.div`
  display: flex;
`;

const Icon = styled.div`
  display: inline-block;
  color: ${props =>
    props.disabled ? props.theme.gray : props.theme.gray.darken(0.3)};
  font-size: 1.5rem;
  line-height: 0.5;
  margin: 0 0.1rem;
  vertical-align: middle;
  text-align: center;

  ${props =>
    !props.disabled &&
    `
    &:hover {
      background-color: #e2e2e2;
      cursor: pointer;
    }`};
`;

const AddressBarContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin: 0 0.5rem;
`;

const SwitchContainer = styled.div`
  flex: 0 0 3.5rem;
`;

type Props = {
  url: string,
  onChange: (text: string) => void,
  onConfirm: () => void,
  onBack: ?() => void,
  onForward: ?() => void,
  onRefresh: ?() => void,
  openNewWindow: ?() => void,
  isProjectView: boolean,
  toggleProjectView: () => void,
  zenMode: boolean,
};

export default ({
  url,
  onChange,
  onConfirm,
  onBack,
  onForward,
  onRefresh,
  isProjectView,
  toggleProjectView,
  openNewWindow,
  zenMode,
}: Props) => (
  <Container>
    <Icons>
      <Icon disabled={!onBack} onClick={onBack}>
        <LeftIcon />
      </Icon>
      <Icon disabled={!onForward} onClick={onForward}>
        <RightIcon />
      </Icon>
      <Icon onClick={onRefresh}>
        <RefreshIcon />
      </Icon>
    </Icons>
    <AddressBarContainer>
      <AddressBar url={url} onChange={onChange} onConfirm={onConfirm} />
    </AddressBarContainer>
    {!zenMode &&
      openNewWindow && (
        <Icon style={{ marginRight: '0.75rem' }} onClick={openNewWindow}>
          <ExternalIcon />
        </Icon>
      )}
    {!zenMode &&
      toggleProjectView && (
        <SwitchContainer>
          <Tooltip
            title={isProjectView ? 'Project View' : 'Current Module View'}
            position="left"
          >
            <Switch right={isProjectView} onClick={toggleProjectView} />
          </Tooltip>
        </SwitchContainer>
      )}
  </Container>
);
