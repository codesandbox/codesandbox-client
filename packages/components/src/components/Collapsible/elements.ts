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
      // TODO: this should come from a token which we name - Sidebar.hoverBackground?
      backgroundColor: 'sideBar.border',
      svg: {
        // TODO: this should come from somewhere else - text muted?
        color: 'grays.300',
      },
    },
  })
);

// replace with <Text variant="strong">
export const Title = styled.div(
  css({
    fontSize: 3,
    fontWeight: 'semibold',
  })
);

// replace with <Icon name="triangle/toggle">
export const Icon = styled.svg<{
  open?: boolean;
}>(props =>
  css({
    marginRight: 2,
    transform: props.open ? 'rotate(0)' : 'rotate(-90deg)',
    color: 'grays.400',
  })
);
