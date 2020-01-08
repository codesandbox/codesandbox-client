import css from '@styled-system/css';
import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { Element } from '../Element';
import { Text } from '../Text';

export const Section = styled(Element).attrs({ as: 'section' })(
  css({
    fontSize: 3,
  })
);

export const Header = styled.div(
  css({
    display: 'flex',
    alignItems: 'center',
    height: 6,
    paddingX: 3,
    borderBottom: '1px solid',
    // Note: sideBarSectionHeader exists but we dont use it because it is rarely implemented
    // in themes, so intentionally ignoring the declaration and using sidebar colors makes sense.
    borderColor: 'sideBar.border',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'sideBar.hoverBackground',
      svg: {
        // TODO: this should come from somewhere else - text muted maybe?
        color: 'grays.300',
      },
    },
  })
);

// temporary: replace with <Icon name="triangle/toggle">
export const Icon = styled.svg<{
  open?: boolean;
}>(props =>
  css({
    marginRight: 2,
    transform: props.open ? 'rotate(0)' : 'rotate(-90deg)',
    color: 'grays.400',
  })
);

export const Body = styled.div(
  css({
    borderBottom: '1px solid',
    borderColor: 'sideBar.border',
    paddingTop: 4,
    paddingBottom: 8,
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

type Props = {
  defaultOpen?: boolean;
  title: string;
};
export const Collapsible: FunctionComponent<Props> = ({
  defaultOpen = false,
  title,
  children,
  ...props
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Section {...props}>
      <Header onClick={() => setOpen(show => !show)}>
        <ToggleIcon open={open} />

        <Text weight="medium">{title}</Text>
      </Header>

      {open ? <Body>{children}</Body> : null}
    </Section>
  );
};
