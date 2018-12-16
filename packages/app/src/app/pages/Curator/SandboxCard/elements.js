// @ts-check
import styled from 'styled-components';
import fadeIn from 'common/utils/animation/fade-in';
import Tooltip from 'common/components/Tooltip';
import Button from 'app/components/Button';

export const PADDING = 32;

export const Container = styled.div`
  ${fadeIn(0)};
  background-color: ${props => props.theme.background};
  overflow: hidden;
  border-radius: 2px;
  user-select: none;

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
  position: relative;
  display: flex;
  padding: 0.6rem 0.75rem;
  font-size: 0.875em;

  align-items: center;
`;

export const SandboxTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const PrivacyIconContainer = styled(Tooltip)`
  display: flex;
  margin-left: 0.5rem;
  color: rgba(255, 255, 255, 0.4);
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

export const Avatar = styled.img`
  width: 30px;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

export const Details = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875em;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 1rem;
`;

export const FlexCenter = styled.section`
  display: flex;
  align-items: center;
`;

export const Pick = styled(Button)`
  width: 100%;
`;

export const Wrapper = styled.div`
  padding: 2px;
  border-radius: 2px;
  background-color: transparent;
`;

export const Line = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  width: 2px;
  height: calc(100% + 34px);
  background-color: ${props => props.color};
`;
