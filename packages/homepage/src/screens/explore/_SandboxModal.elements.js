import styled, { css } from 'styled-components';
import { UserWithAvatar } from '@codesandbox/common/lib/components/UserWithAvatar';

import RightArrow from 'react-icons/lib/md/keyboard-arrow-right';
import LeftArrow from 'react-icons/lib/md/keyboard-arrow-left';
import Stats from '@codesandbox/common/lib/components/Stats';

export const Container = styled.div`
  position: relative;
  background-color: ${props => props.theme.background2};
  display: flex;
  flex-direction: column;
  border-radius: 4px;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
`;

const ArrowStyles = css`
  transition: 0.3s ease color;
  top: 50%;
  font-size: 48px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

export const StyledRightArrow = styled(RightArrow)`
  position: absolute;
  right: -54px;
  ${ArrowStyles};

  @media screen and (max-width: 800px) {
    right: -40px;
  }
`;

export const StyledLeftArrow = styled(LeftArrow)`
  position: absolute;
  left: -54px;
  ${ArrowStyles};

  @media screen and (max-width: 800px) {
    left: -40px;
  }
`;

export const SandboxInfoContainer = styled.div`
  display: flex;

  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

export const StatsContainer = styled.div`
  flex: 1;
  padding: 1.5rem;
  margin-top: 3px;
  font-weight: 600;
  color: ${props => props.theme.new.description};
`;

export const StyledStats = styled(Stats)`
  margin-top: 11px;
`;

export const StatsHeader = styled.h2`
  color: ${props => props.theme.new.title};
  font-size: 1.25rem;
  margin-top: 0 !important;
  margin-bottom: 0;
  font-weight: 700;
`;

export const Author = styled(UserWithAvatar)`
  position: absolute;
  left: 0.875rem;
  bottom: 1.5rem;
  color: ${props => props.theme.new.description};
  font-weight: 600;
`;

export const SandboxInfo = styled.div`
  padding: 1.5rem;
  color: ${props => props.theme.new.title};
  flex: 2;
  min-height: 200px;
`;

export const Footer = styled.footer`
  padding: 1rem 1.5rem;
  padding-top: 10px;
`;

export const FooterInfo = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

export const SandboxTitle = styled.h1`
  font-size: 1.5rem;
  color: ${props => props.theme.new.title};
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

export const SandboxDescription = styled.p`
  color: ${props => props.theme.new.title};
  color: ${props => props.theme.new.description};
`;

export const TemplateLogo = styled.section`
  display: flex;
  align-items: center;

  svg,
  img {
    margin-right: 10px;
  }
`;
