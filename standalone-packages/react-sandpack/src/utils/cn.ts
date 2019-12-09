const LIB_NAME = 'sandpack';

export default function generateClassName(
  namespace: string,
  stylename: string
) {
  return `${LIB_NAME}-${namespace}__${stylename}`;
}
