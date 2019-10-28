import styled from 'styled-components';
import css from '@styled-system/css';

export const Container = styled.div(
  css({
    display: 'flex',
    alignItems: 'center',
    marginBottom: 4,
  })
);

export const Avatar = styled.img(
  css({
    size: '24px',
    borderRadius: '2px',
    border: '1px solid',
    borderColor: 'grays.400',
  })
);

export const Name = styled.span(
  css({
    display: 'inline-block',
    fontSize: 2,
    marginLeft: 2,
  })
);
