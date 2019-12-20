import styled, {
  StyledComponent,
  StyledComponentInnerOtherProps,
} from 'styled-components';
import css from '@styled-system/css';

// hard coded for desktop, not responsive yet
const SIDEBAR_WIDTH = '272px';

export const Container = styled.div(
  css({
    display: 'flex',
    fontFamily: 'Inter, sans-serif',
    // this should ideally be defined by the modal
    // not the contents inside it
    height: 600,

    // we use box-sizing: initial on the body
    '*': {
      boxSizing: 'border-box',
    },
  })
);

export const Sidebar = styled.div(
  css({
    backgroundColor: 'grays.500',
    color: 'white',
    fontSize: 3,

    width: SIDEBAR_WIDTH,
    overflowY: 'auto',
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

export const SectionHeader = styled.button<{ open?: Boolean }>(({ open }) =>
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
      transform: open ? null : 'rotate(-90deg)',
      transition: 'transform ease-in',
      transitionDuration: theme => theme.speeds[3],
    },
  })
);

export const SectionBody = styled.div(
  css({
    paddingX: 4,
    paddingTop: 4,
    paddingBottom: 8,
    borderBottom: '1px solid',
    borderColor: 'grays.800',
  })
);

export const OptionDescription = styled.p(css({}));

export const Input = styled.input<{ code?: boolean }>(({ code }) =>
  css({
    backgroundColor: 'grays.700',
    border: '1px solid',
    borderColor: 'grays.800',
    color: 'white',
    fontSize: 3,
    borderRadius: 'small',
    paddingX: 2,

    width: '100%',
    boxSizing: 'border-box', // probably not right
    height: 32,
    lineHeight: '32px',

    fontFamily: code ? 'code' : 'body',

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

export const TextArea = styled(Input).attrs({ as: 'textarea' })(
  css({
    height: 'auto', // let rows attr take care of height
    lineHeight: 1.6,
    marginBottom: 2,
    resize: 'none',
  })
) as StyledComponent<
  'textarea',
  any,
  StyledComponentInnerOtherProps<typeof Input>
>;

export const Button = styled.button(
  css({
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'blues.600',
    border: '1px solid',
    borderColor: 'blues.600',
    color: 'white',
    fontSize: 2,
    fontFamily: 'body',
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
  })
);

export const Option = styled.label<{
  multiline?: boolean;
  disabled?: boolean;
}>(({ multiline, disabled }) =>
  css({
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
    lineHeight: 1.6,
    marginY: 2,

    display: multiline ? 'block' : 'flex',
    input: {
      width: multiline ? '100%' : 48,
    },

    opacity: disabled ? 0.25 : 1,
  })
);

export const SwitchBase = styled.span(
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

export const SwitchToggle = styled.span(
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

export const SwitchLabel = styled.label(
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
    width: `calc(100% - ${SIDEBAR_WIDTH})`,
    background: 'white',
    iframe: {
      width: '100%',
      height: 500,
      border: 0,
      borderRadius: 'medium',
      overflow: 'hidden',
    },
  })
);
