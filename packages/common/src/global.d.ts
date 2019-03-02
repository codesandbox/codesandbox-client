declare var process: {
  env: {
    NODE_ENV: 'development' | 'production';
    PUBLIC_URL?: string;
    CODESANDBOX_HOST?: string;
    LOCAL_SERVER?: boolean;
    STAGING?: boolean;
    STAGING_BRANCH?: string;
    ROOT_URL?: string;
    VSCODE?: boolean;
  };
};

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}
