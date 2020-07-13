import styled from 'styled-components';
import css from '@styled-system/css';

export const Page = styled.div(
  css({
    backgroundColor: 'grays.900',
    color: 'white',

    // the following evil exists because we are inserting
    // a diffrently styled page onto a already (legacy) styled
    // base.
    width: '100vw',
    minHeight: '100vh',
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
