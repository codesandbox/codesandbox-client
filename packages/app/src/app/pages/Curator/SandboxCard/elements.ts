// @ts-check
import styled from 'styled-components';
import fadeIn from '@codesandbox/common/lib/utils/animation/fade-in';

export const Container = styled.div`
  ${fadeIn(0)};
  background-color: ${props => props.theme.colors.sideBar.background};
  overflow: hidden;
  border-radius: 2px;
  user-select: none;
`;

export const SandboxImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: stretch;
  height: 160px;
`;

export const SandboxImage = styled.div`
  background-size: cover;
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

export const ImageMessage = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  font-weight: 600;
  z-index: 0;

  font-size: 1.125rem;
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
  margin-top: 1rem;
`;

export const FlexCenter = styled.section`
  display: flex;
  align-items: center;
`;
