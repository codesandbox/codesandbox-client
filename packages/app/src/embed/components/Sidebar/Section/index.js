import React from 'react';
import { Header, Icon, Title, Body } from './elements';

function Section({ openByDefault, title, children, ...props }) {
  const [open, setOpen] = React.useState(openByDefault || false);
  const toggle = () => setOpen(!open);

  return (
    <section {...props}>
      <Header onClick={toggle}>
        <ToggleIcon open={open} />
        <Title>{title}</Title>
      </Header>
      {open ? <Body>{children}</Body> : null}
    </section>
  );
}

function ToggleIcon(props) {
  return (
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
}

export default Section;
