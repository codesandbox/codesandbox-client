import styled from 'styled-components';
import Margin from 'common/components/spacing/Margin';

export const Container = Margin.extend`
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
`;

export const Error = styled.div`
  margin: 1rem;
  color: ${({ theme }) => theme.red};
  font-size: 0.875rem;
`;
