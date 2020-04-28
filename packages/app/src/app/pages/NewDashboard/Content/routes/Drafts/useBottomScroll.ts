import { useEffect, useState } from 'react';
import { useOvermind } from 'app/overmind';

const SCROLLING_ELEMENT = document.getElementById('root');
const NUMBER_OF_SANDBOXES = 30;

export const useBottomScroll = key => {
  const {
    state: {
      dashboard: { sandboxes, getFilteredSandboxes, orderBy },
    },
  } = useOvermind();

  const filtered = sandboxes[key] ? getFilteredSandboxes(sandboxes[key]) : null;
  const [visibleSandboxes, setVisibleSandboxes] = useState([]);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (
        SCROLLING_ELEMENT.getBoundingClientRect().bottom - 400 <=
          window.innerHeight &&
        sandboxes[key] &&
        filtered
      ) {
        setVisibleSandboxes(s =>
          s.concat(filtered.slice(s.length, s.length + NUMBER_OF_SANDBOXES))
        );
      }
    });
  });

  useEffect(() => {
    if (filtered) {
      setVisibleSandboxes(filtered.slice(0, visibleSandboxes.length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy]);

  useEffect(() => {
    if (sandboxes.DRAFTS) {
      setVisibleSandboxes(filtered.slice(0, NUMBER_OF_SANDBOXES));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandboxes.DRAFTS]);

  return [visibleSandboxes, filtered];
};
