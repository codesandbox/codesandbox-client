import styled from 'styled-components';
import Tooltip from 'common/lib/components/Tooltip';

export const Container = styled(Tooltip)`
  margin-left: 0.25rem;
  color: ${props => props.theme.primary()};
`;
