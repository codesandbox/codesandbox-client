import { useAppState } from "app/overmind";
import { useGlobalPersistedState } from "./usePersistedState";

export const useBetaSandboxEditor = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  () => void
] => {
  const { hasLogIn } = useAppState();

  const defaultValue =
    hasLogIn && !document.location.search.includes("editorMode=v1");

  return useGlobalPersistedState<boolean>("BETA_SANDBOX_EDITOR", defaultValue);
};
