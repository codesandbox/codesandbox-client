import { Badge } from './Badge';

export type CurrentUser = {
  id: string | null;
  email: string | null;
  name: string | null;
  username: string;
  avatarUrl: string | null;
  jwt: string | null;
  subscription: {
    since: string;
    amount: number;
    cancelAtPeriodEnd: boolean;
    plan?: 'pro' | 'patron';
  } | null;
  curatorAt: string;
  badges: Badge[];
  integrations: {
    zeit?: {
      token: string;
      email?: string;
    };
    github?: {
      email: string;
    };
  };
  sendSurvey: boolean;
};
