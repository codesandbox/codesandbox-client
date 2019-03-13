export {}; // this file needs to be a module

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PUBLIC_URL?: string;
      CODESANDBOX_HOST?: string;
      LOCAL_SERVER?: string;
      STAGING?: string;
      STAGING_BRANCH?: string;
      ROOT_URL?: string;
      VSCODE?: string;
    }
  }
}
