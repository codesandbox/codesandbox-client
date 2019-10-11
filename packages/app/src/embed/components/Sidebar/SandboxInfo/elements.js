import styled from 'styled-components';
import css from '@styled-system/css';

export const Container = styled.div(
  css({
    padding: 4,
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
    color: 'grays.300',
    marginBottom: 4,
  })
);
