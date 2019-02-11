import fetch from 'isomorphic-unfetch';

export default async (req, url) => {
  const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
  const data = await fetch(baseUrl + url);
  const json = await data.json();

  return json;
};
