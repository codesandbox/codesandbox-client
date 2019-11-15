const tweets = [
  {
    name: 'Addy Osmani',
    quote: 'CodeSandbox is a constant joy to use.',
    URL: 'https://twitter.com/addyosmani/status/1164360161114218496?s=20',
    username: 'addyosmani',
  },
  {
    name: 'Brian Vaughn',
    quote: 'I ❤️ CodeSandbox',
    URL: 'https://twitter.com/brian_d_vaughn/status/1072524714239770624?s=20',
    username: 'brian_d_vaughn',
  },
  {
    name: 'Brian Vaughn',
    quote:
      "Communicating via GitHub issues is so much easier when you're exchanging runnable code samples.",
    URL: 'https://twitter.com/brian_d_vaughn/status/1072524714239770624',
    username: 'brian_d_vaughn',
  },
  {
    name: 'Brian Vaughn',
    quote: 'It has drastically simplified my life as an OSS maintainer',
    URL: 'https://twitter.com/brian_d_vaughn/status/1043246419186835456?s=20',
    username: 'brian_d_vaughn',
  },
  {
    name: 'Brian Vaughn',
    quote:
      "It's dramatically improved my experience of sharing ideas and responding to online questions",
    URL: 'https://twitter.com/brian_d_vaughn/status/987758237104594945?s=20',
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
    quote: 'CodeSandbox is easy to use, has amazing integrations',
    URL: 'https://twitter.com/EmmaWedekind/status/1145977857203724288?s=20',
    username: 'EmmaWedekind',
  },
  {
    name: 'Emma Wedekind',
    quote: 'It is by far the best online code editor I’ve ever used',
    URL: 'https://twitter.com/EmmaWedekind/status/1145977857203724288?s=20',
    username: 'EmmaWedekind',
  },
  {
    name: 'Emma Wedekind',
    quote: "If you haven't used this app, what are you waiting for?!",
    URL: 'https://twitter.com/EmmaWedekind/status/1117329044029214720?s=20',
    username: 'EmmaWedekind',
  },
  {
    name: 'Emma Wedekind',
    quote:
      'I just created a sandbox and pushed directly to GitHub. The process was so incredibly smooth I am amazed.',
    URL: 'https://twitter.com/EmmaWedekind/status/1117329044029214720?s=20',
    username: 'EmmaWedekind',
  },
  {
    name: 'Jason Laster',
    quote: 'Is codesandbox now the best IDE for react development? 🤔',
    URL: 'https://twitter.com/jasonlaster11/status/1164204244288692225?s=20',
    username: 'jasonlaster11',
  },
  {
    name: 'Jason Miller',
    quote: 'Start building instantly online',
    URL: 'https://twitter.com/_developit/status/900380193977753600?s=20',
    username: '_developit',
  },
  {
    name: 'Jen Looper',
    quote: 'Vue Vixens: "all our web workshops are built with it!',
    URL: 'https://twitter.com/jenlooper/status/1097512772924043266?s=20',
    username: 'jenlooper',
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
    quote: 'pushing the boundaries of editors! 🔥💪💥',
    URL: 'https://twitter.com/auchenberg/status/1125779298596544513?s=20',
    username: 'auchenberg',
  },
  {
    name: 'Kent C. Dodds',
    quote:
      'attendees can work through the whole thing without downloading any code thanks to the amazing CodeSandbox',
    URL: 'https://twitter.com/kentcdodds/status/1144247825565274113?s=20',
    username: 'kentcdodds',
  },
  {
    name: 'Kent C. Dodds',
    quote: 'you can make PRs to GitHub repositories using CodeSandbox',
    URL: 'https://twitter.com/kentcdodds/status/1020349994124087297?s=20',
    username: 'kentcdodds',
  },
  {
    name: 'Kent C. Dodds',
    quote: 'CodeSandbox is my life now',
    URL: 'https://twitter.com/kentcdodds/status/888096596319023104?s=20',
    username: 'kentcdodds',
  },
  {
    name: 'Kent C. Dodds',
    quote: 'This tool is one of my absolute favorites 😍',
    URL: 'https://twitter.com/kentcdodds/status/880046461186002944?s=20',
    username: 'kentcdodds',
  },
  {
    name: 'Roy Derks',
    quote:
      'I often use CodeSandbox to create demos or try out new JavaScript features or packages',
    URL: 'https://twitter.com/gethackteam/status/1173522963162959872?s=20',
    username: 'gethackteam',
  },
  {
    name: 'Sarah Drasner',
    quote: 'CodeSandbox is truly amazing 🥰',
    URL: 'https://twitter.com/sarah_edo/status/1163874202807484416?s=20',
    username: 'sarah_edo',
  },
  {
    name: 'Sarah Drasner',
    quote:
      'you can import a github repo into CodeSandbox and it will stay up to date with your latest commits',
    URL: 'https://twitter.com/sarah_edo/status/1109484684130422785?s=20',
    username: 'sarah_edo',
  },
  {
    name: 'Chris Traganos',
    quote: "Loving CodeSandbox and all it's magic 🎉",
    URL: 'https://twitter.com/ctraganos/status/1173721552069771264',
    username: 'ctraganos',
  },
  {
    name: 'Henrik Joreteg',
    quote: "I've gotta say, CodeSandbox is badass",
    URL: 'https://twitter.com/HenrikJoreteg/status/981645693868589056?s=20',
    username: 'HenrikJoreteg',
  },
  {
    name: 'Jen Weber',
    quote:
      'Ember core dev: I can embed working Ember examples into my Medium posts!',
    URL: 'https://twitter.com/jwwweber/status/1064296082576936961',
    username: 'jwwweber',
  },
  {
    name: 'Jonnie Hallman',
    quote: 'it feels much more like my local environment',
    URL: 'https://twitter.com/destroytoday/status/1173805935384350720',
    username: 'destroytoday',
  },
  {
    name: 'Marvin Hagemeister',
    quote: 'CodeSandbox is the best thing that has happened to OSS maintainers',
    URL: 'https://twitter.com/marvinhagemeist/status/1103184579723173888?s=20',
    username: 'marvinhagemeist',
  },
  {
    name: 'Marvin Hagemeister',
    quote:
      'It kinda feels like cheating when you get an issue with a sandbox where it can be easily reproduced. Makes fixing them so much easier 🙌',
    URL: 'https://twitter.com/marvinhagemeist/status/1103184579723173888',
    username: 'marvinhagemeist',
  },
  {
    name: 'Peggy Rayzis',
    quote: 'CodeSandbox continues to amaze me every day 😍',
    URL: 'https://twitter.com/peggyrayzis/status/976631190802386944?s=20',
    username: 'peggyrayzis',
  },
  {
    name: 'Peggy Rayzis',
    quote:
      "I'm obsessed with CodeSandbox's GitHub import feature!! 😍 One click and you can convert a repo to a sandbox that automatically stays up to date with the latest commits.",
    URL: 'https://twitter.com/peggyrayzis/status/976557689651236864?s=20',
    username: 'peggyrayzis',
  },
  {
    name: 'Rob Eisenberg',
    quote: 'this is a great way to prototype and share ideas',
    URL: 'https://twitter.com/EisenbergEffect/status/1050437945344253952',
    username: 'EisenbergEffect',
  },
  {
    name: 'Stefan Judis',
    quote: 'Okay – CodeSandbox you rock!!! 👏',
    URL: 'https://twitter.com/stefanjudis/status/1173604221381435397',
    username: 'stefanjudis',
  },
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
