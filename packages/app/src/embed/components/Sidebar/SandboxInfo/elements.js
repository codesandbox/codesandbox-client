import styled from 'styled-components';
import css from '@styled-system/css';
import CommonStats from '@codesandbox/common/lib/components/Stats';
import { CenteredText } from '@codesandbox/common/lib/components/Stats/Stat/elements';

export const Container = styled.div(
  css({
    paddingX: 4,
  })
);

export const Title = styled.h2(
  css({
    fontSize: 3,
    fontWeight: 'medium',
    margin: 0,
    marginBottom: 1,
  })
);

export const Description = styled.div(
  css({
    fontSize: 2,
    color: 'sideBar.foreground',
    marginBottom: 4,
  })
);

export const Stats = styled(CommonStats)(
  css({
    fontSize: 2,
    color: 'grays.400',
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
