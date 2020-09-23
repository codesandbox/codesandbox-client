import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Text, ITextProps } from '../Text';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & ITextProps & {};

export const Label = styled(Text).attrs({ as: 'label' })<LabelProps>(css({}));
