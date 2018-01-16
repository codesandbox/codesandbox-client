import preval from 'babel-plugin-preval/macro';

const versionType = preval`module.exports = (() => {

  if (process.env.NODE_ENV === 'development') {
    if (process.env.STAGING) {
      return 'STAGING'
    }
      return 'DEV';

  }
  return 'PROD'
})()`;

const versionNumber = Math.floor(preval`module.exports = Date.now()` / 1000);

export default preval(`module.exports = "${versionType}-${versionNumber}"`);
