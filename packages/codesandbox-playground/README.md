# CodeSandbox Playground

> A React component that lets you embed an application with any npm dependency.
> Using the technology of CodeSandbox.

## Example usage

```jsx
import Playground from 'codesandbox-playground';

const files = {
  'index.js': `
    import uuid from 'uuid';

    console.log(uuid());
  `,
};

export default () => <Playground files={files} />;
```

## Inspiration

[react-live](https://github.com/FormidableLabs/react-live) is an inspiration for
this library.

### Advantages of react-live

You should react-live when you don't want to rely on CodeSandbox to render your
code, and if you want your examples to be server side rendered.

### Advantages of codesandbox-playground

CodeSandbox supports multi file examples.
