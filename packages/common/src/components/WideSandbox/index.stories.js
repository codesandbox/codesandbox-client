import React from 'react';
import { object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import WideSandbox from './index.tsx';

const Sandbox = {
  id: 'jp64y1jl15',
  view_count: 385,
  version: 5,
  user_liked: false,
  updated_at: '2019-02-28T19:58:25.869808',
  title: 'LOOOL',
  template: 'static',
  team: null,
  tags: [],
  source_id: '4baffb72-2355-42d1-a1f3-0c835dc5af5d',
  screenshot_url: 'https://screenshots.codesandbox.io/jp64y1jl15.png',
  room_id: null,
  privacy: 0,
  picks: [],
  owned: false,
  original_git_commit_sha: '319fd59bb6e454810d7b609bc108f88cd88cf654',
  original_git: {
    username: 'codesandbox-app',
    repo: 'static-template',
    path: '',
    commit_sha: '319fd59bb6e454810d7b609bc108f88cd88cf654',
    branch: 'master',
  },
  npm_dependencies: {},
  modules: [
    {
      updated_at: '2019-02-28T19:58:25.905520',
      title: 'package.json',
      source_id: '4baffb72-2355-42d1-a1f3-0c835dc5af5d',
      shortid: 'H1gwPDrw2X',
      is_binary: false,
      inserted_at: '2019-02-07T12:26:05.570784',
      id: 'de57f27e-7c0b-45db-b1bd-441ffd5af72c',
      directory_shortid: null,
      code:
        '{\n  "name": "loool",\n  "version": "1.0.0",\n  "description": "LOOOK ATR ME MOM",\n  "main": "index.html",\n  "scripts": {\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  },\n  "repository": {\n    "type": "git",\n    "url": "git+https://github.com/codesandbox-app/static-template.git"\n  },\n  "keywords": [],\n  "author": "Ives van Hoorne",\n  "license": "MIT",\n  "bugs": {\n    "url": "https://github.com/codesandbox-app/static-template/issues"\n  },\n  "homepage": "https://github.com/codesandbox-app/static-template#readme"\n}',
    },
    {
      updated_at: '2019-02-07T12:26:07.153183',
      title: 'index.html',
      source_id: '4baffb72-2355-42d1-a1f3-0c835dc5af5d',
      shortid: 'B1wvPBw37',
      is_binary: false,
      inserted_at: '2019-02-07T12:26:05.573708',
      id: '71cfc161-436f-41a9-89a3-e511781f84fa',
      directory_shortid: null,
      code:
        '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<meta http-equiv="X-UA-Compatible" content="ie=edge">\n\t<title>Static Template</title>\n</head>\n\n<body>\n\t<h1>This is a static template, there is no bundler or bundling involved!</h1>\n</body>\n\n</html>',
    },
    {
      updated_at: '2019-02-07T12:26:05.563147',
      title: 'sandbox.config.json',
      source_id: '4baffb72-2355-42d1-a1f3-0c835dc5af5d',
      shortid: 'HkbPvvHDnX',
      is_binary: false,
      inserted_at: '2019-02-07T12:26:05.563128',
      id: '8cc9c3e0-cbe1-45be-8695-d9aa72c76e01',
      directory_shortid: null,
      code: '{\n  "template": "static"\n}\n',
    },
  ],
  like_count: 0,
  is_sse: false,
  is_frozen: false,
  git: null,
  fork_count: 0,
  external_resources: [],
  entry: 'index.html',
  directories: [],
  description: 'LOOOK ATR ME MOM',
  collection: false,
  author: {
    view_count: 26337,
    username: 'SaraVieira',
    twitter: 'NikkitaFTW',
    subscription_since: '2018-03-01T16:00:18.032858Z',
    showcased_sandbox_shortid: 'jp64y1jl15',
    sandbox_count: 329,
    received_like_count: 57,
    profile_email: 'sara@codesandbox.io',
    name: 'Sara Vieira',
    inserted_at: '2017-07-18T23:49:53.950233',
    id: '8d35d7c1-eecb-4aad-87b0-c22d30d12081',
    given_like_count: 29,
    forked_count: 981,
    featured_sandboxes: [],
    curator_at: '2018-11-25T18:51:34.542902Z',
    bio: 'I am sara',
    badges: [{ visible: true, name: 'Patron II', id: 'patron_2' }],
    avatar_url: 'https://avatars0.githubusercontent.com/u/1051509?v=4',
  },
};

storiesOf('WideSandbox', module).add('Default', () => (
  <WideSandbox sandbox={object('Sandbox', Sandbox)} settings={{}} />
));
