import { useEffect } from 'react';
import useKeys from 'react-use/lib/useKeyboardJs';
import { useOvermind } from 'app/overmind';

export const useKeyboard = (
  list: { current: HTMLElement },
  searchInput: { current: HTMLElement }
) => {
  const {
    actions: {
      modalOpened,
      editor: { addNpmDependency },
    },
    state: {
      workspace: { explorerDependencies },
    },
  } = useOvermind();
  const [one] = useKeys('ctrl + one');
  const [two] = useKeys('ctrl + two');
  const [three] = useKeys('ctrl + three');
  const [four] = useKeys('ctrl + four');
  const [all] = useKeys('ctrl + d');
  const [up] = useKeys('up');
  const [down] = useKeys('down');
  const [enter] = useKeys('enter');

  const addDependency = dependency => {
    addNpmDependency({
      name: dependency.name,
      version: dependency.tags.latest,
    });
  };

  useEffect(() => {
    if (list && list.current) {
      const first = list.current.firstChild;
      const last = list.current.lastChild;
      const input = searchInput.current;
      const activeElement = document.activeElement;
      if (up) {
        if (
          activeElement === (input || first) ||
          !activeElement.parentNode.previousSibling
        ) {
          if (activeElement === first || first.contains(activeElement)) {
            input.focus();
          }
          // do nothing
        } else {
          // @ts-ignore
          activeElement.parentNode.previousSibling.firstChild.focus();
        }
      }
      if (down) {
        if (activeElement === last || last.contains(activeElement)) {
          // do nothing
        } else if (activeElement === input) {
          // @ts-ignore
          first.firstChild.focus();
        } else {
          // @ts-ignore
          activeElement.parentNode.nextSibling.firstChild.focus();
        }
      }

      if (explorerDependencies.length) {
        if (enter && activeElement === input) {
          addDependency(explorerDependencies[0]);
        }
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [one, two, three, four, all, up, down, list, enter]);
};
