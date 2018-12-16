import styled from 'styled-components';
import Button from 'app/components/Button';

export const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  margin-bottom: 0.5rem;
  margin-top: 2rem;
`;

export const ComingSoon = styled.div`
  position: relative;

  &:hover {
    .overlay {
      opacity: 1;
    }
  }
`;

export const Overlay = styled.div`
  transition: 0.3s ease opacity;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;

  padding: 2rem;

  display: flex;
  justify-content: center;

  font-weight: 600;
  font-size: 1.5rem;

  color: white;
`;

export const PatronInfo = styled.div`
  position: absolute;
  left: 100%;
  margin-left: 2rem;
  width: 400px;
`;

export const QuestionHeader = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  color: white;
`;

export const Releases = styled(Button)`
  position: absolute;
  box-sizing: border-box;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  width: calc(100% - 4rem);
`;
