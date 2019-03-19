const DotTag = styled.div`
  color: #ebebeb;
  font-size: ${props => props.theme.fontSize};
  font-family: Helvetica;
  ${mixin};
`;

const StringTagname = styled("div")`
  color: #ff0000;
`;

const Component = styled(Component)`
  color: #ebebeb;
`;

const SegmentedComponent = styled(Segmented.Component)`
  padding: 3px;
`;

const mixin = css`
  height: 20px;
  padding: 5px;
`;

// const comment = css`
//     height: 20px;
//     padding: 5px;
// `

const arrowFun = (...args) => css`
  height: 12px;
`;

const test =
  "broken"; /* Highlighting is broken after a styled-component is returned from an arrow function*/

class InsideMethod extends React.Component {
  render() {
    return styled(Component)`
      line-height: 21px;
    `;
  }
}

let variableAssignment;

variableAssignment = css`
  height: 1px;
`(
  /* expression */
  styled.div`
    height: 12px;
  `
);

export default styled(ExportComponent)`
  max-width: 100%;
`;

function insideFunction() {
  return styled.div`
    height: 15px;
  `;
}

const ObjectLiteral = {
  styles: styled`
        height: 12px;
        color: #000000;
        font: ${props => "lol"};
        ${props => "padding: 5px"}
        ${props => "border"}: 1px solid #000000;
    `
};

const rotate360 = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(1turn);
    }
`;

// .extend

const Comp = styled.div`
  color: red;
`;

const NewComp = Comp.extend`
  color: green;
`;

// .withComponent()

const NewCompWithString = CompWithComponent.withComponent("span").extend`
  color: green;
`;

const NewCompWithString = CompWithComponent.withComponent("span")`
  color: green;
`;

const NewCompWithStringOneLine = CompWithComponent.withComponent(
  "span"
)`color: green;`;

const NewCompWithComponent = CompWithComponent.withComponent(OtherComp)`
  color: green;
`;

// Typescript
const Root = styled<RootProps>("div")`
  height: ${props => (props.label ? 72 : 48)}px;
`;

// Typescript, Emotion
// prettier-ignore
const Container = styled<ContainerProps, 'div'>('div')`
  height: 50px;
  display: ${(props) => props.display};
`

// SC.attrs({})

const Link = styled.a.attrs({
  target: "_blank"
})`
  color: red;
`;

// Functional Media Queries - https://www.styled-components.com/docs/advanced#media-templates
const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 376
};

const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)};
    }
  `;
});
const Input = styled.input.attrs({
  // we can define static props
  type: "password",

  // or we can define dynamic ones
  margin: props => props.size || "1em",
  padding: props => props.size || "1em"
})`
  color: palevioletred;
  font-size: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;

  /* here we use the dynamically computed props */
  margin: ${props => props.margin};
  padding: ${props => props.padding};
`;

const mediaQuery = styled.div`
  background: palevioletred;

  ${media.desktop`
    background: red;
  `};

  ${media.breakAt("300px")`
    background: palevioletred;
  `} ${media.desktop(400)`
    background: coral;
  `};
`;
const Input = styled.input.attrs({
  // we can define static props
  type: "password",

  // or we can define dynamic ones
  margin: props => props.size || "1em",
  padding: props => props.size || "1em"
})`
  color: palevioletred;
  font-size: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;

  /* here we use the dynamically computed props */
  margin: ${props => props.margin};
  padding: ${props => props.padding};
`;

const Input = styled.input.attrs({
  // we can define static props
  type: "password",

  // or we can define dynamic ones
  margin: props => props.size || "1em",
  padding: props => props.size || "1em"
})`
  color: palevioletred;
  font-size: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;

  ${media.desktop`
    background: red;
  `};

  ${media.breakAt("300px")`
    background: palevioletred;
  `} ${media.desktop(400)`
    background: coral;
  `};

  /* here we use the dynamically computed props */
  margin: ${props => props.margin};
  padding: ${props => props.padding};
`;

injectGlobal`
  @font-face {
    font-family: "Operator Mono";
    src: url("../fonts/Operator-Mono.ttf");
  }

  body {
    margin: 0;
  }
`;

const GlobalStyles = createGlobalStyle`
  html {
    color: 'red';
  }
`;
