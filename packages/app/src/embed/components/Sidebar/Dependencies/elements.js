import styled from 'styled-components';
import css from '@styled-system/css';

export const Container = styled.div(
  css({
    paddingX: 4,
    fontSize: 3,
  })
);

export const Row = styled.div(
  css({
    display: 'flex',
    justifyContent: 'space-between',
    lineHeight: '24px',
  })
);

export const Link = styled.a(
  css({
    color: 'inherit',
    textDecoration: 'none',
  })
);
