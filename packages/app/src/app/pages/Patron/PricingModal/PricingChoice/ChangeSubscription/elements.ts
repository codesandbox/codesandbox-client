import styled from 'styled-components';
import Button from 'app/components/Button';

export const SmallText = styled.div`
  text-align: center;
  font-size: 0.875rem;

  margin: 1rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1rem;
`;

export const StyledButton = styled(Button)`
  margin: 1rem;
`;
