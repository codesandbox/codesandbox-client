import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';

export const Container = styled.div(
  css({
    display: 'flex',
    fontFamily: 'Inter, sans-serif',

    button: { fontFamily: 'body' },
    input: { fontFamily: 'body' },
    textarea: { fontFamily: 'body' },
    select: { fontFamily: 'body' },
  })
);

export const Sidebar = styled.div(
  css({
    backgroundColor: 'grays.500',
    color: 'white',
    fontSize: 3,

    maxWidth: 300, // for development, remove this
    height: '100%', // for development, remove this
    // overflowY: 'scroll',
  })
);

export const Heading = styled.h1(
  css({
    margin: 0,
    marginBottom: 2,
  })
);

export const Description = styled.p(
  css({
    margin: 0,
    marginBottom: 4,
  })
);

const SectionHeader = styled.button(props =>
  css({
    display: 'flex',
    width: '100%',
    alignItems: 'center',

    color: '#fff',
    fontSize: 3,
    fontWeight: 'medium',
    paddingY: 4,
    paddingX: 2,
    background: 'transparent',

    border: 'none',
    borderBottom: '1px solid',
    borderColor: 'grays.700',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'grays.700',
    },
    ':focus': {
      backgroundColor: 'grays.700',
      outline: 'none',
    },
    svg: {
      marginRight: 2,
      transform: props.open ? null : 'rotate(-90deg)',
      transition: 'transform ease-in',
      transitionDuration: theme => theme.speeds[3],
    },
  })
);

const SectionBody = styled.div(props =>
  css({
    paddingX: 4,
    paddingTop: 4,
    paddingBottom: 8,
    borderBottom: '1px solid',
    borderColor: 'grays.800',
    ...props.css,
  })
);

export const OptionDescription = styled.p(css({}));

export const Section = ({ title, children, defaultOpen, ...props }) => {
  const [open, isOpen] = React.useState(title ? defaultOpen : true);

  return (
    <section {...props}>
      <SectionHeader open={open} onClick={() => isOpen(!open)}>
        <ToggleIcon />
        {title}
      </SectionHeader>
      {open ? <SectionBody>{children}</SectionBody> : null}
    </section>
  );
};

Section.Body = SectionBody;

export const Input = styled.input(props =>
  css({
    backgroundColor: 'grays.700',
    border: '1px solid',
    borderColor: 'grays.800',
    color: 'white',
    fontSize: 3,
    borderRadius: 'small',
    paddingX: 2,

    width: '100%',
    boxSizing: 'border-box', //probably not right
    height: 32,
    lineHeight: '32px',

    fontFamily: props.code ? 'code' : 'body',

    ':hover': {
      backgroundColor: 'grays.800',
    },
    ':focus': {
      backgroundColor: 'grays.800',
      borderColor: 'grays.800',
      outline: 'none',
    },
    ':disabled:hover': {
      backgroundColor: 'grays.700',
    },
  })
);

export const TextArea = styled(Input)(
  css({
    height: 'auto', // let rows attr take care of height
    lineHeight: 1.6,
    marginBottom: 2,
  })
);

export const Button = styled.button(
  css({
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'blues.600',
    border: '1px solid',
    borderColor: 'blues.600',
    color: 'white',
    fontSize: 2,
    height: 24,
    borderRadius: 'medium',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'blues.500',
      borderColor: 'blues.500',
    },
    ':focus': {
      outline: 'none',
      backgroundColor: 'blues.600',
      borderColor: 'blues.500',
    },

    textDecoration: 'line-through',
  })
);

export const Option = styled.label(props =>
  css({
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
    lineHeight: 1.6,
    marginY: 2,

    display: props.multiline ? 'block' : 'flex',
    input: {
      width: props.multiline ? '100%' : 48,
    },

    opacity: props.disabled ? 0.25 : 1,
  })
);

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

export const Switch = props => (
  <SwitchLabel>
    <input
      type="checkbox"
      disabled={props.disabled}
      checked={props.on}
      onChange={props.onChange}
    />
    <SwitchBase>
      <SwitchToggle />
    </SwitchBase>
  </SwitchLabel>
);

const SwitchBase = styled.span(
  css({
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: 28,
    height: 14,
    borderRadius: 'large',
    background: '#040404',
  })
);

const SwitchToggle = styled.span(
  css(theme => ({
    background: 'white',
    width: 14,
    height: 14,
    borderRadius: 'round',
    position: 'absolute',
    left: 0,
    transition: 'left ease',
    transitionDuration: theme.speeds[3],
  }))
);

const SwitchLabel = styled.label(
  css({
    cursor: 'pointer',

    input: {
      width: 0,
      opacity: 0,
      position: 'absolute',
    },

    // styled-components way of reffering to sc-elements
    // but in an object notation, it's a mess not gonna lie.
    [`input:checked + ${SwitchBase}`]: {
      background: '#5bc266',
    },
    [`input:checked + ${SwitchBase} ${SwitchToggle}`]: {
      left: 14,
    },
  })
);

export const Preview = styled.div(
  css({
    padding: 8,
    width: '100%',
    background: 'white',
    iframe: {
      width: '100%',
      height: 500,
      border: 0,
      borderRadius: 2,
      overflow: 'hidden',
    },
  })
);
