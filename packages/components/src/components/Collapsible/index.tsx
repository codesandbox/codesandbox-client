import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import VisuallyHidden from '@reach/visually-hidden';
import { Element } from '../Element';
import { Text } from '../Text';
import { SidebarRow } from '../SidebarRow';

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
}>(props =>
  css({
    transform: props.open ? 'rotate(0)' : 'rotate(-90deg)',
    transition: 'transform',
    transitionDuration: theme => theme.speeds[1],
    opacity: 0.25,
  })
);

export const Body = styled(Element)<{
  open?: boolean;
}>(props =>
  css({
    borderBottom: props.open ? '1px solid' : 'none',
    borderColor: 'sideBar.border',
    overflow: props.open ? 'auto' : 'hidden',
    paddingTop: props.open ? 4 : 0,
    paddingBottom: props.open ? 8 : 0,
    opacity: props.open ? 1 : 0,
    transition: 'all',
    transitionDuration: theme => theme.speeds[4],
  })
);

const ToggleIcon = props => (
  <Icon
    width="9"
    height="6"
    viewBox="0 0 9 6"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.50009 6L-5.24537e-07 1.26364e-06L9 4.76837e-07L4.50009 6Z"
      fill="currentcolor"
    />
  </Icon>
);

interface ICollapsibleProps {
  defaultOpen?: boolean;
  title: string;
}

export const Collapsible: React.FC<ICollapsibleProps> = ({
  defaultOpen,
  title,
  children,
  ...props
}) => {
  const [open, setOpen] = React.useState(defaultOpen || false);
  const toggle = () => setOpen(!open);

  return (
    <Section {...props}>
      <Header onClick={toggle}>
        <ToggleIcon open={open} />
        <Text weight="medium">{title}</Text>
        <VisuallyHidden>
          <input type="checkbox" checked={open} readOnly />
        </VisuallyHidden>
      </Header>

      <Body open={open}>{open ? children : null}</Body>
    </Section>
  );
};
