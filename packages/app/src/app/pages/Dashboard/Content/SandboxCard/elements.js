// @ts-check
import styled from 'styled-components';
import fadeIn from 'common/utils/animation/fade-in';
import Tooltip from 'common/components/Tooltip';
import ContextMenu from 'app/components/ContextMenu';
import MoreInfoIcon from './KebabIcon';

export const PADDING = 32;

export const Line = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  width: 2px;
  height: 100%;
  background-color: ${props => props.color};
`;

export const Container = styled.div`
  ${fadeIn(0)};
  background-color: ${props => props.theme.background};
  overflow: hidden;
  border-radius: 2px;
  user-select: none;

  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

export const StyledContextMenu = styled(ContextMenu)`
  padding-right: ${PADDING}px;
  box-sizing: border-box;
  opacity: ${({ isDraggingItem }) => (isDraggingItem ? 0 : 1)};
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
  position: relative;
  display: flex;
  padding: 0.6rem 0.75rem;
  font-size: 0.875em;

  align-items: center;
`;

export const SandboxTitle = styled.div`
  display: flex;
  align-items: center;
`;

export const PrivacyIconContainer = styled(Tooltip)`
  display: flex;
  margin-left: 0.5rem;
  color: rgba(255, 255, 255, 0.4);
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

export const KebabIcon = styled(MoreInfoIcon)`
  transition: 0.3s ease color;
  font-size: 1.75rem;
  height: 16px;
  width: 20px;
  color: rgba(255, 255, 255, 0.6);

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;
