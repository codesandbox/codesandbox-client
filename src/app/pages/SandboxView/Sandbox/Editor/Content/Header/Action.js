import React from 'react';
import styled from 'styled-components';

import Tooltip from 'app/components/Tooltip';

const Action = styled.div`
  transition: 0.3s ease all;
  display: flex;
  flex-direction: row;
  align-items: center;
  vertical-align: middle;
  font-size: 1rem;
  line-height: 1;
  padding: 0 1rem;
  height: 100%;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  z-index: 1;

  &:hover {
    color: rgba(255,255,255, 1);
    border-bottom: 2px solid ${props => props.theme.secondary};
  }
`;

const ActionTooltip = styled(Tooltip)`
  transition: 0.3s ease all;
  display: flex;
  flex-direction: row;
  align-items: center;
  vertical-align: middle;
  font-size: 1rem;
  line-height: 1;
  padding: 0 1rem;
  height: 100%;
  color: rgba(255,255,255,0.3);
  cursor: default;
  border-bottom: 2px solid transparent;
  z-index: 1;

  &:hover {
    color: rgba(255,255,255, 0.4);
    border-bottom: 2px solid ${props => props.theme.secondary};
  }
`;

const IconContainer = styled.div`
  padding-right: 0.5rem;
  vertical-align: middle;
`;

type Props = {
  onClick: ?Function,
  Icon: React.Component<any, any>,
  title: string,
  placeholder: ?boolean,
};

export default ({ onClick, Icon, title, placeholder }: Props) => {
  if (placeholder) {
    return (
      <ActionTooltip message={placeholder}>
        <IconContainer>
          <Icon />
        </IconContainer> {title}
      </ActionTooltip>
    );
  }

  return (
    <Action onClick={onClick}>
      <IconContainer>
        <Icon />
      </IconContainer> {title}
    </Action>
  );
};
