import { useAppState } from "app/overmind";
import { useGlobalPersistedState } from "./usePersistedState";

export const useBetaSandboxEditor = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  () => void
] => {
  const { hasLogIn } = useAppState();

  const globalState = useGlobalPersistedState<boolean>(
    "BETA_SANDBOX_EDITOR",
    hasLogIn
  );
  const hasV1Override = document.location.search.includes("editorMode=v1");

  if (hasV1Override) {
    // @ts-ignore
    return [
      false,
      () => {
        // noop
      },
      () => {
        // noop
      },
    ];
  }

  return globalState;
};
