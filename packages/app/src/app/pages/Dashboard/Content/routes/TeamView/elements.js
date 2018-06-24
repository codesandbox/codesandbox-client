import styled from 'styled-components';
import CrossIcon from 'react-icons/lib/md/clear';

export const TeamContainer = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const Section = styled.div`
  flex: 1;
  width: 100%;

  margin-right: 2rem;
`;

export const Members = styled.div`
  margin-top: 1rem;
`;

export const MemberHeader = styled.div`
  margin: 1.5rem 0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;

  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
`;

export const StyledCrossIcon = styled(CrossIcon)`
  transition: 0.3s ease color;
  color: white;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.red};
  }
`;
