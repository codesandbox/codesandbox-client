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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingY: 1,
  })
);
