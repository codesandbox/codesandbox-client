import styled from 'styled-components';

export const Description = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);

  line-height: 1.6;
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
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
