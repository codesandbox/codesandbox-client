// @ts-check
import styled, { injectGlobal } from 'styled-components';
import fadeIn from 'common/utils/animation/fade-in';
import Tooltip from 'common/components/Tooltip';
import Button from 'app/components/Button';

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  .ReactModal__Content.ReactModal__Content--after-open.picked-sandbox-modal {
    overflow: visible !important;
  }
`;

export const PADDING = 32;

export const Wrapper = styled.div`
  padding: 2;
  border-radius: 2;
  background-color: transparent;
  position: relative;

  &:nth-child(5n + 1) {
    grid-column: span 2;

    footer {
      background: transparent;
      position: relative;
      z-index: 12;
    }

    .sandbox-image {
      height: 185%;
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      height: 80%;
      background: linear-gradient(
        180deg,
        rgba(196, 196, 196, 0) 0%,
        rgba(67, 70, 72, 0.86) 75.14%,
        rgba(6, 10, 12, 0.7) 100%
      );
      width: 100%;
      bottom: 25px;
      border-radius: 4px;
      z-index: 10;
      opacity: 0.5;
    }
  }
`;

export const Container = styled.div`
  ${fadeIn(0)};
  background-color: ${props => props.theme.background};
  overflow: hidden;
  border-radius: 4px;
  user-select: none;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  width: 100%;
  z-index: 1;
`;

export const SandboxInfo = styled.div`
  position: relative;
  display: flex;
  font-size: 0.875em;

  align-items: center;
`;

export const SandboxTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #ffffff;
`;

export const Header = styled.header`
  padding: 24px 13px;
  padding-top: 12px;
`;

export const PrivacyIconContainer = styled(Tooltip)`
  display: flex;
  margin-left: 0.5rem;
  color: rgba(255, 255, 255, 0.4);
`;

export const Description = styled.section`
  padding-top: 12px;
  font-size: 12px;
  color: #cbcbcb;
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
  color: rgba(255, 255, 255, 1);
  padding: 24px 13px;
  background: #1c2022;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export const FlexCenter = styled.section`
  display: flex;
  align-items: center;
`;

export const Pick = styled(Button)`
  width: 100%;
`;
