import styled, {
  StyledComponent,
  StyledComponentInnerOtherProps,
} from 'styled-components';
import css from '@styled-system/css';

export const Container = styled.div(
  css({
    '.tippy-content': {
      width: '200px',
      backgroundColor: 'grays.500',
      border: '1px solid',
      borderColor: 'grays.600',
      padding: 4,
      borderRadius: 'medium',
      whiteSpace: 'normal',
    },
  })
);

export const Element = styled.div<{
  margin?: number;
  marginX?: number;
  marginBottom?: number;
}>(props =>
  css({
    margin: props.margin || null,
    marginX: props.marginX || null,
    marginBottom: props.marginBottom || null,
  })
);

export const Text = styled(Element)<{
  color?: string;
  size?: string;
  align?: string;
}>(props =>
  css({
    color: props.color || 'white',
    fontSize: props.size || 'inherit',
    textAlign: props.align || 'left',
  })
);

export const Link = styled.a(
  css({
    color: 'blues.300',
    textDecoration: 'none',
  })
);

export const Select = styled(Element).attrs({ as: 'select' })(({ theme }) =>
  css({
    width: '100%',
    backgroundColor: 'grays.800',
    color: 'white',
    borderColor: 'grays.600',
    padding: 2,
    height: 24,
    boxSizing: 'border-box',
    fontFamily: 'body',
    transition: 'background',
    transitionDuration: theme.speeds[2],
    ':hover': {
      backgroundColor: 'grays.700',
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      ':hover': {
        backgroundColor: 'grays.800',
      },
    },
  })
) as StyledComponent<
  'select',
  any,
  StyledComponentInnerOtherProps<typeof Element>
>;
