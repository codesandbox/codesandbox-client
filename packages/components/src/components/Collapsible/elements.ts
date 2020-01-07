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
    // Note: sideBarSectionHeader exists but we dont use it because it is rarely implemented
    // in themes, so intentionally ignoring the declaration and using sidebar colors makes sense.
    borderColor: 'sideBar.border',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'sideBar.hoverBackground',
      svg: {
        // TODO: this should come from somewhere else - text muted maybe?
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
