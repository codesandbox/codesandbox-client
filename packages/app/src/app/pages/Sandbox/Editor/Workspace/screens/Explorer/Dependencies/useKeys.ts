import { useEffect } from 'react';
import useKeys from 'react-use/lib/useKeyboardJs';
import { useAppState, useActions, useEffects } from 'app/overmind';
import { Dependency } from '@codesandbox/common/lib/types/algolia';

export const useKeyboard = (searchInput: { current: HTMLFormElement }) => {
  const {
    modalOpened,
    editor: { addNpmDependency },
  } = useActions();
  const { explorerDependencies } = useAppState().workspace;
  const effects = useEffects();
  const [one] = useKeys('ctrl + one');
  const [two] = useKeys('ctrl + two');
  const [three] = useKeys('ctrl + three');
  const [four] = useKeys('ctrl + four');
  const [all] = useKeys('ctrl + d');
  const [enter] = useKeys('enter');

  const addDependency = (dependency: Dependency) => {
    if (dependency.tags) {
      addNpmDependency({
        name: dependency.name,
        version: dependency.tags?.latest,
      });
    } else {
      effects.notificationToast.error(
        `There has been a problem installing ${dependency.name}. No installable version found`
      );
    }
  };

  useEffect(() => {
    const list = document.getElementById('list');
    const activeElement = document.activeElement;
    const input = searchInput.current;
    if (enter && activeElement === input) {
      if (input.value.includes('@')) {
        const isScoped = input.value.startsWith('@');
        let version = 'latest';

        const dependencyAndVersion = input.value.split('@');

        if (dependencyAndVersion.length > (isScoped ? 2 : 1)) {
          version = dependencyAndVersion.pop();
        }

        addNpmDependency({
          name: dependencyAndVersion.join('@'),
          version,
        });
      } else if (list && explorerDependencies.length) {
        addDependency(explorerDependencies[0]);
      } else if (
        input.value.startsWith('https://') ||
        input.value.startsWith('http://')
      ) {
        const value = input.value.split('/');
        addNpmDependency({
          name: value[value.length - 1],
          version: input.value,
        });
      }
    }

    if (list && explorerDependencies.length) {
      if (one) {
        addDependency(explorerDependencies[0]);
      }
      if (two && explorerDependencies[1]) {
        addDependency(explorerDependencies[1]);
      }
      if (three && explorerDependencies[2]) {
        addDependency(explorerDependencies[2]);
      }
      if (four && explorerDependencies[3]) {
        addDependency(explorerDependencies[3]);
      }
      if (all) {
        modalOpened({ modal: 'searchDependencies' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [one, two, three, four, all, enter]);
};
