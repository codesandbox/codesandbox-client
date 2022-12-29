import { Card } from '@codesandbox/components';
import styled from 'styled-components';

interface StyledCardProps {
  dimmed?: boolean;
}

export const StyledCard = styled(Card)<StyledCardProps>(({ dimmed }) => ({
  opacity: dimmed ? 0.5 : 1,
  transition: 'background ease-in-out, opacity ease-in-out',
  transitionDuration: '75ms',
  '&:hover': {
    backgroundColor: '#252525',
  },
  color: '#999999',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));
