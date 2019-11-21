const tweets = [
  {
    name: 'Addy Osmani',
    quote: 'CodeSandbox is a constant joy to use.',
    URL: 'https://twitter.com/addyosmani/status/1164360161114218496?s=20',
    username: 'addyosmani',
  },
  {
    name: 'Brian Vaughn',
    quote: 'It has drastically simplified my life as an OSS maintainer',
    URL: 'https://twitter.com/brian_d_vaughn/status/1043246419186835456?s=20',
    username: 'brian_d_vaughn',
  },
  {
    name: 'Elijah Manor',
    quote: 'I ❤️ CodeSandbox',
    URL: 'https://twitter.com/elijahmanor/status/893177666274283520?s=20',
    username: 'elijahmanor',
  },
  {
    name: 'Emma Wedekind',
    quote: 'It is by far the best online code editor I’ve ever used',
    URL: 'https://twitter.com/EmmaWedekind/status/1145977857203724288?s=20',
    username: 'EmmaWedekind',
  },
  {
    name: 'Jen Looper',
    quote: 'I’m so amazed by CodeSandbox! Just epic ❤️',
    URL: 'https://twitter.com/jenlooper/status/964797655137177600?s=20',
    username: 'jenlooper',
  },
  {
    name: 'John Lindquist',
    quote:
      'CodeSandbox is one of the best things to ever happen to the internet ♥️♥️♥️',
    URL: 'https://twitter.com/johnlindquist/status/1151138090972413952?s=20',
    username: 'johnlindquist',
  },
  {
    name: 'Kenneth Auchenberg',
    quote: 'Pushing the boundaries of editors! 🔥💪💥',
    URL: 'https://twitter.com/auchenberg/status/1125779298596544513?s=20',
    username: 'auchenberg',
  },
  {
    name: 'Marvin Hagemeister',
    quote: 'CodeSandbox is the best thing that has happened to OSS maintainers',
    URL: 'https://twitter.com/marvinhagemeist/status/1103184579723173888?s=20',
    username: 'marvinhagemeist',
  },
  {
    name: 'Peggy Rayzis',
    quote: 'CodeSandbox continues to amaze me every day 😍',
    URL: 'https://twitter.com/peggyrayzis/status/976631190802386944?s=20',
    username: 'peggyrayzis',
  }
];

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default shuffle(tweets);
