import styled from 'styled-components';
import CrossIcon from 'react-icons/lib/md/clear';
import EditIcon from 'react-icons/lib/go/pencil';

export const Owner = styled.div`
  float: right;
  font-size: 0.875rem;
  font-weight: 400;
  font-style: italic;
`;

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

  @media (max-width: 768px) {
    margin-left: 1rem;
  }
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

export const StyledEditIcon = styled(EditIcon)`
  transition: 0.3s ease color;
  vertical-align: middle;
  font-size: 1rem;
  margin-bottom: 5px;
  margin-left: 0.75rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  cursor: pointer;

  &:hover {
    color: white;
  }
`;
