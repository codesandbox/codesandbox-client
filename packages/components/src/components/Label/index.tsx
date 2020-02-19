import styled from 'styled-components';
import css from '@styled-system/css';
import { Text } from '../Text';

interface ILabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = styled(Text).attrs({ as: 'label' })<ILabelProps>(css({}));
