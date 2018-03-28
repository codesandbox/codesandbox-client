import styled from 'app/styled-components';
import Margin from 'common/components/spacing/Margin';

export const Container = Margin.extend`
  color: rgba(255, 255, 255, 0.8);
`;

export const Error = styled.div`
  margin: 1rem;
  color: ${({ theme }) => theme.red};
  font-size: 0.875rem;
`;
