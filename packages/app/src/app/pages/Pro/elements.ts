import styled from 'styled-components';
import css from '@styled-system/css';

export const Content = styled.div(
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

export const Heading = styled.h1(
  css({
    margin: 0,
    textAlign: 'center',
    // marketing pages have a lot of whitespace, more than our scale
    marginTop: '100px',
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

export const Form = styled.form(
  css({
    fontSize: 3,
    width: 300,
    margin: 'auto',
    input: {
      fontSize: 3,
      height: 32,
      width: '100%',
    },
    button: {
      fontSize: 4,
      lineHeight: '32px',
      width: '100%',
      marginBottom: 10,
    },
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
    backgroundColor: 'blues.600',
    color: 'white',
    border: 'none',
    borderRadius: 'medium',
    cursor: 'pointer',
    boxSizing: 'border-box',

    transition: 'backgroundColor',
    transitionDuration: theme => theme.speeds[2],

    ':hover': {
      backgroundColor: 'blues.500',
    },
  })
);

export const HelpText = styled.p(
  css({
    color: 'grays.400',
    textAlign: 'center',
    b: {
      color: 'white',
    },
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
