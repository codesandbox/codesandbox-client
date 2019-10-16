import React from 'react';
import { Header, Icon, Title, Body } from './elements';

function Section(props) {
  const [open, setOpen] = React.useState(props.defaultOpen || false);
  const toggle = () => setOpen(!open);

  return (
    <section>
      <Header onClick={toggle}>
        <ToggleIcon open={open} />
        <Title>{props.title}</Title>
      </Header>
      {open ? <Body>{props.children}</Body> : null}
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
