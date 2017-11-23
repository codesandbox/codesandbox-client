export default (code: string) => {
  if (code.includes("from 'react'")) return 'react';
  return 'function';
};
