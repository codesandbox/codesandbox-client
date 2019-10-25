import styled from 'styled-components';
import css from '@styled-system/css';

export const Body = styled.div(
  css({
    borderBottom: '1px solid',
    borderColor: 'sideBar.border',
    paddingTop: 4,
    paddingBottom: 8,
  })
);

export const Header = styled.div(
  css({
    display: 'flex',
    alignItems: 'center',
    height: '32px',
    paddingX: 3,
    borderBottom: '1px solid',
    borderColor: 'sideBar.border',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'sideBar.border',
      svg: {
        color: 'grays.300',
      },
    },
  })
);

export const Title = styled.div(
  css({
    fontSize: 3,
  })
);

export const Icon = styled.svg(props =>
  css({
    marginRight: 2,
    transform: props.open ? 'rotate(0)' : 'rotate(-90deg)',
    color: 'grays.400',
  })
);
