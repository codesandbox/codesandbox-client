import { addProp, InitializerType } from './code-manipulation';

describe('single line', () => {
  it('can add a prop for self closing', () => {
    const singleLineComponent = `<Component a={5} />`;
    expect(
      addProp(singleLineComponent, 'test', InitializerType.Boolean)
    ).toMatchSnapshot();
    expect(
      addProp(singleLineComponent, 'test', InitializerType.Expression)
    ).toMatchSnapshot();
    expect(
      addProp(singleLineComponent, 'test', InitializerType.String)
    ).toMatchSnapshot();
  });

  it('can add a prop for open', () => {
    const singleLineComponent = `<Component a={5}>`;
    expect(
      addProp(singleLineComponent, 'test', InitializerType.Boolean)
    ).toMatchSnapshot();
    expect(
      addProp(singleLineComponent, 'test', InitializerType.Expression)
    ).toMatchSnapshot();
    expect(
      addProp(singleLineComponent, 'test', InitializerType.String)
    ).toMatchSnapshot();
  });
});

describe('multiline', () => {
  it('can add a prop', () => {
    const multiLineComponent = `<Component\n  a={5}\n/>`;
    expect(
      addProp(multiLineComponent, 'test', InitializerType.Boolean)
    ).toMatchSnapshot();
    expect(
      addProp(multiLineComponent, 'test', InitializerType.Expression)
    ).toMatchSnapshot();
    expect(
      addProp(multiLineComponent, 'test', InitializerType.String)
    ).toMatchSnapshot();
  });

  it('can add a prop to selfclose same line', () => {
    const multiLineComponent = `<Component\n  a={5}/>`;
    expect(
      addProp(multiLineComponent, 'test', InitializerType.Boolean)
    ).toMatchSnapshot();
    expect(
      addProp(multiLineComponent, 'test', InitializerType.Expression)
    ).toMatchSnapshot();
    expect(
      addProp(multiLineComponent, 'test', InitializerType.String)
    ).toMatchSnapshot();
  });
});
