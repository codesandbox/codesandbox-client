const host = typeof process !== 'undefined' && process.env.CODESANDBOX_HOST;
export default host || 'https://codesandbox.io';
