import css from '@styled-system/css';
import styled, {
  StyledComponent,
  StyledComponentInnerOtherProps,
} from 'styled-components';

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

export const Container = styled(Element)(
  css({
    '.tippy-content': {
      width: '200px',
      backgroundColor: 'grays.600',
      border: '1px solid',
      borderColor: 'grays.500',
      padding: 4,
      borderRadius: 'medium',
      whiteSpace: 'normal',
    },
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

const caret =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMTAgMjQiIHdpZHRoPSIxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjNzU3NTc1Ij48cGF0aCBkPSJtNS4wMDAwNiAxNy0zLjAwMDA2LTRoNnoiLz48cGF0aCBkPSJtNC45OTk5NCA3IDMuMDAwMDYgNGgtNnoiLz48L2c+PC9zdmc+';

export const Select = (styled(Element).attrs({ as: 'select' })(({ theme }) =>
  css({
    appearance: 'none',
    backgroundImage: `url(${caret})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '96% 50%',
    width: '100%',
    backgroundColor: 'grays.900',
    color: 'white',
    border: '1px solid',
    borderColor: 'grays.500',
    borderRadius: 'medium',
    paddingX: 2,
    height: 24,
    boxSizing: 'border-box',
    fontFamily: 'body',
    transition: 'backgroundColor',
    transitionDuration: theme.speeds[2],
    ':hover': {
      backgroundColor: 'grays.700',
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      ':hover': {
        backgroundColor: 'grays.900',
      },
    },
  })
) as unknown) as StyledComponent<
  'select',
  any,
  StyledComponentInnerOtherProps<typeof Element>
>;

// Wasn't able to use the Button from the components package due to missing
// theme values.
export const Button = styled.button`
  box-sizing: border-box;
  width: 100%;
  border: none;
  font-family: Inter, sans-serif;
  background-color: #343434;
  color: #c2c2c2;
  padding: 4px 16px;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  border-radius: 4px;

  &:hover {
    background-color: #191919;
  }
`;
