export const getSandboxName = (sandbox: {
  title: string;
  alias: string;
  id: string;
}) => sandbox.title || sandbox.alias || sandbox.id;
