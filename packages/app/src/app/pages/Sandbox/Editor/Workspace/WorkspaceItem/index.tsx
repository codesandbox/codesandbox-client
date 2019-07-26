import React, { useState } from 'react';
import { Animate as ReactShow } from 'react-show';
import { useHiddenState, Hidden } from 'reakit/Hidden';

import {
  ChildContainer,
  ItemHeader,
  Title,
  ExpandIconContainer,
  Actions,
  HideButton,
} from './elements';

type Props = {
  children: React.ReactNode;
  title: string;
  keepState?: boolean;
  disabled?: boolean;
  defaultOpen?: boolean;
  actions?: React.Component<any, any>;
  style?: React.CSSProperties;
};

const WorkspaceItem = ({
  children,
  defaultOpen = false,
  title,
  keepState,
  disabled,
  actions,
  style,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const hidden = useHiddenState({ visible: defaultOpen });

  return (
    <>
      <HideButton {...hidden}>
        <ItemHeader style={style} onClick={() => setOpen(!open)}>
          <ExpandIconContainer open={open} />
          <Title>{title}</Title>

          {open && <Actions>{actions}</Actions>}
        </ItemHeader>
      </HideButton>
      <ReactShow
        style={{
          height: 'auto',
        }}
        transitionOnMount
        start={{
          height: 0,
        }}
        show={open}
        duration={250}
        stayMounted={keepState}
      >
        <Hidden {...hidden}>
          <ChildContainer disabled={disabled}>{children}</ChildContainer>
        </Hidden>
      </ReactShow>
    </>
  );
};

export default WorkspaceItem;
