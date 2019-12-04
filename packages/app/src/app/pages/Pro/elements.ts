import styled from 'styled-components';
import css from '@styled-system/css';
import { SignInButton as CommonSignInButton } from 'app/pages/common/SignInButton';
import { LinkButton as AppLinkButton } from 'app/components/LinkButton';

export const Page = styled.div(
  css({
    backgroundColor: 'grays.800',
    color: 'white',

    // the following evil exists because we are inserting
    // a diffrently styled page onto a already (legacy) styled
    // base.
    width: '100vw',
    minHeight: '100vh',
  })
);

export const Content = styled.div(
  css({
    marginTop: '100px',
  })
);

export const Heading = styled.h1(
  css({
    margin: 0,
    textAlign: 'center',
    // marketing pages have a lot of whitespace, more than our scale
    fontSize: '32px',
  })
);

export const SubHeading = styled.span(
  css({
    color: 'grays.300',
    fontSize: 4,
    display: 'block',
    textAlign: 'center',
    marginBottom: 10,
  })
);

export const Form = styled.form<{ disabled: boolean }>(props =>
  css({
    fontSize: 3,
    width: 300,
    margin: 'auto',
    input: {
      fontSize: 3,
      height: 32,
      width: '100%',
    },
    transition: 'opacity',
    transitionDuration: theme => theme.speeds[2],
    opacity: props.disabled ? 0.5 : 1,
  })
);

export const FormField = styled.div(
  css({
    // we choose to use minHeight to decide height
    // over margin so that when elements load dynamically
    // like stripe card input and error messages,
    // the form fields don't jump around
    minHeight: '88px',
    marginBottom: 2,
  })
);

export const Label = styled.label(
  css({
    display: 'block',
    lineHeight: 1.6,
    marginBottom: 2,
  })
);

export const Input = styled.input(
  css({
    backgroundColor: 'grays.700',
    border: '1px solid',
    borderColor: 'grays.500',
    boxSizing: 'border-box',
    color: 'white',

    paddingX: 4,
    borderRadius: 'medium',
    transition: 'border',
    transitionDuration: theme => theme.speeds[2],

    ':hover': {
      backgroundColor: 'grays.700',
      borderColor: 'grays.600',
    },
    ':focus': {
      outline: 'none',
      backgroundColor: 'grays.800',
      borderColor: 'grays.300',
    },
  })
);

export const Button = styled.button(
  css({
    display: 'block',
    fontSize: 4,
    lineHeight: '32px',
    width: '100%',
    minWidth: 200,
    marginBottom: 10,
    backgroundColor: 'blues.600',
    color: 'white',

    textDecoration: 'none',
    textAlign: 'center',

    border: 'none',
    borderRadius: 'medium',
    boxSizing: 'border-box',
    cursor: 'pointer',
    transition: 'backgroundColor',
    transitionDuration: theme => theme.speeds[2],

    ':hover': {
      backgroundColor: 'blues.500',
    },
    ':disabled': {
      backgroundColor: 'blues.600',
      opacity: 0.5,
    },
  })
);

/* this component exists only to make typecheck happy
  the alternate <Button as="a"> isn't strictly typed
  and typescript doesn't like that

  "deep sigh"
        — Sara Vieira

*/

export const ButtonAsLink = Button.withComponent('a');

export const HelpText = styled.p(
  css({
    color: 'grays.400',
    textAlign: 'center',
    b: {
      color: 'white',
    },
    a: {
      color: 'grays.300',
    },
  })
);

export const LinkButton = styled(AppLinkButton)(
  css({
    color: 'grays.300',
  })
);

export const CardContainer = styled.div(
  css({
    '.StripeElement': {
      backgroundColor: 'grays.700',
      border: '1px solid',
      borderColor: 'grays.500',
      padding: 2,
      boxSizing: 'border-box',
      borderRadius: 'medium',
      minHeight: 32,

      ':hover': {
        backgroundColor: 'grays.700',
        borderColor: 'grays.600',
      },

      '&.StripeElement--focus': {
        backgroundColor: 'grays.800',
        borderColor: 'grays.300',
      },
    },
  })
);

export const ErrorText = styled.div(
  css({
    color: 'reds.500',
    marginTop: 2,
  })
);

export const ModalBackdrop = styled.div(
  css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'grays.700',
    opacity: 0.8,
  })
);

export const SignInModal = styled.div(
  css({
    width: 400,
    position: 'absolute',
    boxSizing: 'border-box',
    top: 'calc(50% - 150px)',
    left: 'calc(50% - 200px)',
    backgroundColor: 'grays.500',
    borderRadius: 'medium',
    padding: 10,
    textAlign: 'center',
    zIndex: 2,

    p: {
      fontSize: '20px',
      fontWeight: 'medium',
      margin: 0,
      marginBottom: 4,
    },
  })
);

export const SignInButton = styled(CommonSignInButton)(
  css({
    width: '100%',
    backgroundColor: 'blues.600',
    borderColor: 'blues.600',

    ':hover': {
      backgroundColor: 'blues.500',
      borderColor: 'blues.500',
    },

    '> div': {
      justifyContent: 'center',
    },
  })
);

export const Avatar = styled.img(
  css({
    width: 100,
    height: 100,
    border: '1px solid',
    borderColor: 'grays.500',
    borderRadius: 'medium',
  })
);

const badgeBackground = {
  pro: 'blues.700',
  patron: 'green',
};

export const Badge = styled.span<{ type: string }>(props =>
  css({
    backgroundColor: badgeBackground[props.type],
    color: props.type === 'pro' ? 'white' : 'grays.800',
    paddingY: 1,
    paddingX: 2,
    fontWeight: 'bold',
    fontSize: 3,
    textTransform: 'capitalize',
    position: 'relative',
    top: -20,
    right: props.type === 'pro' ? -40 : -30,
    border: '1px solid',
    borderColor: 'grays.500',
    borderRadius: 'medium',
  })
);
