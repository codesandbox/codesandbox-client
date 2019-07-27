import { Sandbox } from './';

export const sandbox = (config: Partial<Sandbox> = {}): Sandbox => ({
  ...config,
  id: '1234',
  title: 'Test Sandbox',
  description: 'A test sandbox',
  author: {
    username: 'Test User',
    avatar_url: 'https://placekitten.com/g/200/200',
  },
  tags: ['Tag 1', 'Tag 2', 'Tag 3'],
  template: 'create-react-app-typescript',
  screenshot_url: 'https://placekitten.com/g/1200/300',
  view_count: 100,
  fork_count: 100,
  like_count: 100,
});
