import styled from 'styled-components';
import css from '@styled-system/css';
import { Text, TextProps } from '../Text';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & TextProps & {};

export const Label = styled(Text).attrs({ as: 'label' })<LabelProps>(css({}));
