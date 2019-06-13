import React, { useState } from 'react';
import { Animate as ReactShow } from 'react-show';

import {
  ChildContainer,
  ItemHeader,
  Title,
  ExpandIconContainer,
  Actions,
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

const WorkspaceItem = React.memo(
  ({
    children,
    title,
    keepState,
    disabled,
    actions,
    style,
    defaultOpen,
  }: Props) => {
    const [open, setOpen] = useState(Boolean(defaultOpen));

    return (
      <>
        <ItemHeader style={style} onClick={() => setOpen(!open)}>
          <ExpandIconContainer open={open} />
          <Title>{title}</Title>

          {open && <Actions>{actions}</Actions>}
        </ItemHeader>
        <ReactShow
          style={{
            height: 'auto',
            overflow: 'hidden',
          }}
          transitionOnMount
          start={{
            height: 0, // The starting style for the component.
            // If the 'leave' prop isn't defined, 'start' is reused!
          }}
          show={open}
          duration={250}
          stayMounted={keepState}
        >
          <ChildContainer disabled={disabled}>{children}</ChildContainer>
        </ReactShow>
      </>
    );
  }
);

export default WorkspaceItem;
