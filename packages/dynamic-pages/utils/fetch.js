import fetch from 'isomorphic-unfetch';

export const host = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.CODESANDBOX_HOST.split('//')[1];
  }
  if (process.env.LOCAL_SERVER) {
    return 'localhost:8080';
  }
  return 'localhost:8080';
};

export default async url => {
  const protocol =
    typeof window !== 'undefined' ? window.location.protocol : 'http:';
  const data = await fetch(protocol + '//' + host() + url);
  const json = await data.json();

  return json;
};
