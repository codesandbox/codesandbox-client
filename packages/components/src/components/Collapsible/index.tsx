import VisuallyHidden from '@reach/visually-hidden';
import css from '@styled-system/css';
import React, { ComponentProps, FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { Element, SidebarRow, Text } from '../..';

const Section = styled(Element).attrs({ as: 'section' })(
  css({
    fontSize: 3,
  })
);

export const Header = styled(SidebarRow).attrs({ gap: 2 })(
  css({
    minHeight: '35px',
    paddingX: 3,
    borderBottom: '1px solid',
    // Note: sideBarSectionHeader exists but we dont use it because it is rarely implemented
    // in themes, so intentionally ignoring the declaration and using sidebar colors makes sense.
    borderColor: 'sideBar.border',
    cursor: 'pointer',

    ':hover': {
      backgroundColor: 'sideBar.hoverBackground',
    },

    ':focus-within': {
      backgroundColor: 'sideBar.hoverBackground',
    },
  })
);

// temporary: replace with <Icon name="triangle/toggle">
const Icon = styled.svg<{
  open?: boolean;
}>(({ open }) =>
  css({
    transform: open ? 'rotate(0)' : 'rotate(-90deg)',
    transition: 'transform',
    transitionDuration: theme => theme.speeds[1],
    opacity: 0.25,
  })
);

export const Body = styled(Element)<{
  open?: boolean;
}>(({ open }) =>
  css({
    borderBottom: open ? '1px solid' : 'none',
    borderColor: 'sideBar.border',
    overflow: open ? 'auto' : 'hidden',
    paddingTop: open ? 4 : 0,
    paddingBottom: open ? 8 : 0,
    opacity: open ? 1 : 0,
    transition: 'all',
    transitionDuration: theme => theme.speeds[4],
  })
);

type ToggleIconProps = Pick<ComponentProps<typeof Icon>, 'open'>;
const ToggleIcon: FunctionComponent<ToggleIconProps> = ({ open }) => (
  <Icon
    height="6"
    open={open}
    viewBox="0 0 9 6"
    width="9"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.50009 6L-5.24537e-07 1.26364e-06L9 4.76837e-07L4.50009 6Z"
      fill="currentcolor"
    />
  </Icon>
);

type Props = Omit<ComponentProps<typeof Section>, 'children'> & {
  defaultOpen?: boolean;
  title: string;
};
export const Collapsible: FunctionComponent<Props> = ({
  children,
  defaultOpen = false,
  title,
  ...props
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Section {...props}>
      <Header onClick={() => setOpen(show => !show)}>
        <ToggleIcon open={open} />

        <Text weight="medium">{title}</Text>

        <VisuallyHidden>
          <input checked={open} type="checkbox" />
        </VisuallyHidden>
      </Header>

      <Body open={open}>{open ? children : null}</Body>
    </Section>
  );
};
