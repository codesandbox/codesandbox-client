import styled from 'styled-components';
import css from '@styled-system/css';
import { Text } from '../Text';

export const Label = styled(Text).attrs({ as: 'label' })<{ htmlFor: string }>(
  css({})
);
