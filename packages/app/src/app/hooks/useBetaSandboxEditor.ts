import { useAppState } from 'app/overmind';
import { useGlobalPersistedState } from './usePersistedState';

export const useBetaSandboxEditor = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const { user, hasLogIn } = useAppState();

  const [betaSandboxEditor, setBetaSandboxEditor] = useGlobalPersistedState<
    boolean
  >('BETA_SANDBOX_EDITOR', hasLogIn ? !USER_IDS.includes(user.id) : true);

  return [betaSandboxEditor, setBetaSandboxEditor];
};

// Users that rely on live share
const USER_IDS = [
  '9e82a8db-2c9b-4f44-bcb2-72fd91b96255', // alexnm
  'a348b75a-d2ed-41f1-bbe2-d824b3221bb7', // necolineCSB
];
