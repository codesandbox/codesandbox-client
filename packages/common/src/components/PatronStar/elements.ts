import styled from 'styled-components';
import Tooltip from '../Tooltip';

export const Container = styled(Tooltip)`
  margin-left: 0.25rem;
  color: ${props => props.theme.primary()};
`;
