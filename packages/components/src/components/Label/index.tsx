import css from '@styled-system/css';
import { ComponentProps, LabelHTMLAttributes } from 'react';
import styled from 'styled-components';

import { Text } from '../..';

type Props = LabelHTMLAttributes<HTMLLabelElement> &
  Omit<ComponentProps<typeof Text>, 'children'>;
export const Label = styled(Text).attrs({ as: 'label' })<Props>(css({}));
