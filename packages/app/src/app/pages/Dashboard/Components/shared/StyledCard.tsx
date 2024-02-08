import { Card, InteractiveOverlay } from '@codesandbox/components';
import styled from 'styled-components';

interface StyledCardProps {
  dimmed?: boolean;
  selected?: boolean;
}

export const StyledCard = styled(Card)<StyledCardProps>(
  ({ dimmed, selected }) => ({
    opacity: dimmed ? 0.6 : 1,
    transition: 'background ease-in-out, opacity ease-in-out',
    transitionDuration: '75ms',
    '&:hover': dimmed
      ? undefined
      : {
          backgroundColor: '#252525',
        },

    [`&:has(${InteractiveOverlay.Button}:not(:hover)),
      &:has(${InteractiveOverlay.Anchor}:not(:hover)),
      &:has(${InteractiveOverlay.Item}:not(:hover))`]: {
      backgroundColor: '#1D1D1D',
    },

    color: '#e5e5e5',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',

    // FolderCard is still using this selected style, but we're not
    // using it in SandboxCard anymore
    ...(selected
      ? { outline: '#ac9cff solid 2px', outlineOffset: '-2px' }
      : {}),
  })
);
