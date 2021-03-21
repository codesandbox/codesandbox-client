declare var process: { env: { CODESANDBOX_HOST: string | undefined } };

const host = process.env.CODESANDBOX_HOST;

export default host || 'https://codesandbox.io';
