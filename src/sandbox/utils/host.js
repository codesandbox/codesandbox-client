const host = process.env.NODE_ENV === 'development'
  ? 'http://codesandbox.dev'
  : 'https://codesandbox.io';

export default host;
