import styled from 'styled-components';
import { Element } from '../Element';

export interface CardProps {
  variant?: 'default'; // TODO: Add highlight later
  css?: Object;
}

export const Card = styled(Element)<CardProps>(_ => ({
  padding: '24px',
  borderRadius: '4px',
  backgroundColor: '#1D1D1D',
}));
