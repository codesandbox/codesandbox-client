/* eslint-disable */
const stats = require('../stats.json');

const longTime = stats.modules.filter(stat => {
  if (stat.profile && stat.profile.building > 1000) {
    return stat;
  }
});

longTime
  .sort((a, b) => (a.profile.building > b.profile.building ? 1 : -1))
  .forEach(stat => {
    console.log(
      JSON.stringify(
        {
          id: stat.id,
          profile: stat.profile,
        },
        null,
        2
      )
    );
  });
