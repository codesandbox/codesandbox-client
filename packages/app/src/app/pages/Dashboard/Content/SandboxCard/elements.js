// @ts-check
import styled, { css } from 'styled-components';

export const Container = styled.div`
  background-color: ${props => props.theme.background};
  overflow: hidden;
  border-radius: 2px;
  user-select: none;

  border: 2px solid transparent;

  ${props =>
    props.selected &&
    css`
      border-color: ${props.theme.secondary};
    `};

  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

export const SandboxImageContainer = styled.div`
  position: relative;
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
  z-index: 1;
`;

export const SandboxInfo = styled.div`
  display: flex;
  padding: 0.6rem 0.75rem;
  font-size: 0.875em;

  align-items: center;
`;

export const SandboxDetails = styled.div`
  font-size: 0.875em;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
`;

export const ImageMessage = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  font-weight: 600;
  z-index: 0;

  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.6);
`;
