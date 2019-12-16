import React from 'react';
import {
  SectionHeader,
  SectionBody,
  SwitchLabel,
  SwitchBase,
  SwitchToggle,
} from './elements';

const ToggleIcon = props => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.50498 6L0.00488229 1.26364e-06L9.00488 4.76837e-07L4.50498 6Z"
      fill="currentcolor"
    />
  </svg>
);

export const Section: React.FunctionComponent<{
  title: string;
  defaultOpen?: boolean;
}> = ({ title, defaultOpen, ...props }) => {
  const [open, isOpen] = React.useState(title ? defaultOpen : true);

  return (
    <section {...props}>
      <SectionHeader open={open} onClick={() => isOpen(!open)}>
        <ToggleIcon />
        {title}
      </SectionHeader>
      {open ? <SectionBody>{props.children}</SectionBody> : null}
    </section>
  );
};

export { SectionBody };

export const Switch: React.FunctionComponent<{
  disabled?: boolean;
  on?: boolean;
  onChange: () => void;
}> = ({ disabled, on, onChange, ...props }) => (
  <SwitchLabel>
    <input
      type="checkbox"
      disabled={disabled}
      checked={on}
      onChange={onChange}
      {...props}
    />
    <SwitchBase>
      <SwitchToggle />
    </SwitchBase>
  </SwitchLabel>
);
