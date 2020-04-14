import CommonStats from '@codesandbox/common/lib/components/Stats';
import { CenteredText } from '@codesandbox/common/lib/components/Stats/Stat/elements';
import css from '@styled-system/css';
import styled from 'styled-components';

export const Container = styled.div(
  css({
    paddingX: 4,
  })
);

export const Title = styled.h1(
  css({
    fontSize: 3,
    fontWeight: 'medium',
    margin: 0,
    marginBottom: 1,
  })
);

export const Description = styled.h2(
  css({
    fontSize: 2,
    fontWeight: 'normal',
    color: 'sideBar.foreground',
    marginBottom: 4,
  })
);

export const Stats = styled(CommonStats)(
  css({
    fontSize: 2,
    color: 'grays.400',
    marginBottom: 2,
    // ouch ouch ouch, modifying a child of
    // a common element is just pure evil
    // this will definitely break on the
    // slightest touch to the Stats component
    // TODO: Refactor stats component to accept
    // justify as an input
    [CenteredText]: {
      justifyContent: 'start',
    },
  })
);

export const Button = styled.a(
  css({
    transition: '0.3s ease background-color',
    backgroundColor: theme => (theme.light ? 'grays.200' : 'grays.500'),
    padding: 2,
    display: 'block',
    color: theme => (theme.light ? 'grays.800' : 'white'),
    border: 'none',
    outline: 'none',
    borderRadius: 2,
    width: '100%',
    fontSize: 3,
    boxSizing: 'border-box',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    ':hover': {
      backgroundColor: theme => (theme.light ? 'grays.300' : 'grays.600'),
    },
  })
);
