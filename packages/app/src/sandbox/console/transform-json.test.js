import transformJSON from './transform-json';

describe('transformJSON', () => {
  it('transforms strings properly', () => {
    expect(transformJSON('Hello world')).toMatchSnapshot();
  });
  it('transforms arrays of strings properly', () => {
    expect(
      transformJSON(['Hello world', 'Bonjour le monde'])
    ).toMatchSnapshot();
  });

  it('transforms numbers properly', () => {
    expect(transformJSON(12)).toMatchSnapshot();
  });

  it('transforms arrays of numbers properly', () => {
    expect(transformJSON([12, 46])).toMatchSnapshot();
  });

  it('transforms objects properly', () => {
    expect(
      transformJSON({
        key1: 'Hello',
        key2: 12,
      })
    ).toMatchSnapshot();
  });

  it('transforms arrays of objects properly', () => {
    expect(
      transformJSON([
        {
          key1: 'Hello',
          key2: 'World',
        },
        {
          key1: 'Bonjour',
          key2: 'Le',
          key3: 'Monde',
        },
      ])
    ).toMatchSnapshot();
  });

  it('transforms named functions properly', () => {
    const fn = function hello(a) {
      return a + 1;
    };
    expect(transformJSON(fn)).toMatchSnapshot();
  });

  it('transforms arrow functions properly', () => {
    const fn = a => a + 1;
    expect(transformJSON(fn)).toMatchSnapshot();

    const fn2 = a => {
      const b = 2;
      return a + b;
    };
    expect(transformJSON(fn2)).toMatchSnapshot();
  });

  it('transforms arrays with functions properly', () => {
    const obj = [
      function hello(a) {
        return a + 1;
      },
      b => b + 1,
    ];

    expect(transformJSON(obj)).toMatchSnapshot();
  });

  it('transforms objects with functions properly', () => {
    const obj = {
      fn1: function hello(a) {
        return a + 1;
      },
      fn2: b => b + 1,
    };

    expect(transformJSON(obj)).toMatchSnapshot();
  });

  it('transforms arrays of objects properly', () => {
    const array = [
      {
        a: 12,
        b: 46,
      },
      { c: 'Hello', d: 'World' },
      {
        fn1: function hello(a) {
          return a + 1;
        },
        fn2: b => b + 1,
      },
    ];

    expect(transformJSON(array)).toMatchSnapshot();
  });
});
