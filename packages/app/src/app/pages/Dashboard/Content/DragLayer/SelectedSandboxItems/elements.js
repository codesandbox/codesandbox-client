import styled from 'styled-components';

export const Container = styled.div`
  height: 210px;
  width: 346px;

  background-color: ${props => props.theme.background};
  border-radius: 2px;
`;

export const SandboxImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  height: 160px;

  background-color: rgba(255, 255, 255, 0.1);
`;

export const SandboxImage = styled.div`
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
  width: 100%;
`;

export const SandboxInfo = styled.div`
  padding: 0.6rem 0.75rem;
  font-size: 1em;
`;
