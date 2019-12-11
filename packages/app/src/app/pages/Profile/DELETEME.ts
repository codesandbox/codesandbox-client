type Sandbox = {
  id: string;
  preview: string;
  title: string;
  description: string;
  likes: number;
  views: number;
  forks: number;
  environment: string;
};

type InitialState = {
  user: {
    id: string; // User/Team ID
    avatar: string; // User/Team Avatar Image URL
    isContributor: boolean;
    isPro: boolean;
    isTeam: boolean;
    name: string;
    username: string;
    bio: string;
    totalSandboxes: number; // Number of Sandboxes belonging to the User/Team
    totalTemplates: number; // Number of Templates belonging to the User/Team
    totalLikes: number; // Number of Sandboxes Liked by the User
    // A User's Teams, or a Team's Members
    associations: {
      thumbnail: string; // GitHub Profile Image URL
      url: string; // URL to user or team profile
      entityName: string; // Name of User or Team
    }[];
    socialLinks: string[]; // List of URLs
    // Featured Sandbox
    featured: {
      id: string; // Sandbox ID
      heroImage: string; // URL
    };
    pinned: Sandbox[]; // Possibly Paginated?
    sandboxes: Sandbox[]; // Paginated List
    templates: Sandbox[]; // Paginated List
    likes: Sandbox[]; // Paginated List
  };
};

const sandboxes: Sandbox[] = [
  {
    id: '123',
    preview: `https://i.imgur.com/NOzyPxz.png`,
    title: `wabisabi-js/isthereuber.in`,
    description: `Simple app to tell you where there is uber`,
    likes: 123456789,
    views: 999999,
    forks: 999999,
    environment: `React`,
  },
  {
    id: '456',
    preview: `https://i.imgur.com/u6kR235.png`,
    title: `Getting Started`,
    description: `Simple app to tell you where there is uber`,
    likes: 32,
    views: 122,
    forks: 234,
    environment: `React`,
  },
  {
    id: '789',
    preview: `https://i.imgur.com/a4KpNHf.png`,
    title: `Custom Properties`,
    description: `Simple app to tell you where there is uber`,
    likes: 32,
    views: 122,
    forks: 234,
    environment: `React`,
  },
  {
    id: '012',
    preview: `https://i.imgur.com/JpRs4Gm.png`,
    title: `wabisabi-js/isthereuber.in`,
    description: `Simple app to tell you where there is uber`,
    likes: 32,
    views: 122,
    forks: 234,
    environment: `React`,
  },
  {
    id: '345',
    preview: `https://i.imgur.com/6x1wrIJ.png`,
    title: `wabisabi-js/isthereuber.in`,
    description: `Simple app to tell you where there is uber`,
    likes: 32,
    views: 122,
    forks: 234,
    environment: `React`,
  },
  {
    id: '678',
    preview: `https://i.imgur.com/JxGN2TS.png`,
    title: `wabisabi-js/isthereuber.in`,
    description: `Simple app to tell you where there is uber`,
    likes: 32,
    views: 122,
    forks: 234,
    environment: `React`,
  },
];

export const initialState: InitialState = {
  user: {
    id: `userID`,
    avatar: `https://avatars2.githubusercontent.com/u/42876?s=200&v=4`,
    isContributor: false,
    isPro: false,
    isTeam: true,
    name: `Framer`,
    username: `Festina Lente`,
    bio: `Bring your creative ideas to life with Framer X, the best tool for interactive design. Create responsive layouts, design realistic prototypes, and bring everything closer to production—all in one place`,
    totalSandboxes: 450,
    totalTemplates: 135,
    totalLikes: 789,
    associations: [
      {
        thumbnail: `https://avatars2.githubusercontent.com/u/10724744?s=96&v=4`,
        url: ``,
        entityName: `Stefan Mansson`,
      },
      {
        thumbnail: `https://avatars3.githubusercontent.com/u/12829?s=96&v=4`,
        url: ``,
        entityName: `Eelco Lempsink`,
      },
      {
        thumbnail: `https://avatars0.githubusercontent.com/u/39778?s=96&v=4`,
        url: ``,
        entityName: `Jordan Dobson`,
      },
      {
        thumbnail: `https://avatars3.githubusercontent.com/u/206779?s=96&v=4`,
        url: ``,
        entityName: `Koen Bok`,
      },
      {
        thumbnail: `https://avatars3.githubusercontent.com/u/28392?s=96&v=4`,
        url: ``,
        entityName: `Stefan Borsje`,
      },
    ],
    socialLinks: [
      `https://twitter.com/framer`,
      `https://www.framer.com/`,
      `https://github.com/framer`,
    ],
    featured: {
      id: '123',
      heroImage: `https://i.imgur.com/h2nQnqU.png`,
    },
    pinned: [
      {
        id: '123',
        preview: `https://i.imgur.com/iy4AKF1.png`,
        title: `wabisabi-js/isthereuber.in`,
        description: `Simple app to tell you where there is uber`,
        likes: 999999,
        views: 999999,
        forks: 999999,
        environment: `React`,
      },
      {
        id: '456',
        preview: `https://i.imgur.com/Kl4WYmI.png`,
        title: `wabisabi-js/isthereuber.in`,
        description: `Simple app to tell you where there is uber`,
        likes: 32,
        views: 122,
        forks: 234,
        environment: `React`,
      },
      {
        id: '789',
        preview: `https://i.imgur.com/9xitUWN.png`,
        title: `wabisabi-js/isthereuber.in`,
        description: `Simple app to tell you where there is uber`,
        likes: 32,
        views: 122,
        forks: 234,
        environment: `React`,
      },
      {
        id: '012',
        preview: `https://i.imgur.com/Ihb874i.png`,
        title: `wabisabi-js/isthereuber.in`,
        description: `Simple app to tell you where there is uber`,
        likes: 32,
        views: 122,
        forks: 234,
        environment: `React`,
      },
      {
        id: '345',
        preview: `https://i.imgur.com/t3TVRY8.png`,
        title: `wabisabi-js/isthereuber.in`,
        description: `Simple app to tell you where there is uber`,
        likes: 32,
        views: 122,
        forks: 234,
        environment: `React`,
      },
    ],
    sandboxes,
    templates: sandboxes,
    likes: sandboxes,
  },
};
