declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PUBLIC_URL?: string;
    CODESANDBOX_HOST?: string;
    LOCAL_SERVER?: string;
    STAGING?: string;
    STAGING_BRANCH?: string;
    ROOT_URL?: string;
    VSCODE?: string;
    SANDPACK?: string;
  }
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}
