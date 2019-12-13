import styled, { css } from 'styled-components';

import { UserWithAvatar } from '../UserWithAvatar';

export const BG_COLOR = '#1C2022';
export const BG_HOVER = '#212629';

export const Overlay = styled.div`
  position: absolute;
  background: rgba(28, 32, 34, 0.9);
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 3px);
  padding: 1rem;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 200ms ease;
`;

export const Container = styled.div<{ small?: boolean; noMargin?: boolean }>`
  transition: 0.3s ease all;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  position: relative;
  flex: 1;
  min-width: 300px;

  flex-grow: 1;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;

  margin-right: 0.5rem;
  margin-left: 0.5rem;

  background-color: ${BG_COLOR};
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);

  ${props =>
    props.small &&
    css`
      min-width: auto;
    `};

  ${props =>
    props.noMargin &&
    css`
      margin: 0;
    `};

  &:hover {
    ${Overlay} {
      opacity: 1;
    }
  }

  &:hover {
    background-color: ${BG_HOVER};
    transform: translateY(-5px);
    box-shadow: 0 8px 4px rgba(0, 0, 0, 0.3);
  }

  &:last-child {
    flex-grow: 0;
    min-width: calc(33% - 1rem);
  }
`;

export const SandboxTitle = styled.h2`
  color: ${props => props.color};
  font-family: 'Poppins', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  max-height: 20px;

  word-break: break-all;
`;

export const SandboxDescription = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.lightText};
  font-weight: 500;
  line-height: 1.3;
  margin: 0;
  margin-bottom: 16px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  max-height: 100%;

  word-break: break-all;
`;

export const SandboxImage = styled.img`
  display: block;
  margin-bottom: 0;
  z-index: 0;
  border-bottom: 3px solid ${props => props.color};
  height: auto;
  width: 100%;
  background-color: ${BG_HOVER};
  border-image-width: 0;
`;

export const SandboxInfo = styled.div<{ noHeight?: boolean }>`
  left: -1px;
  right: -1px;
  padding: 0.75rem;
  padding-bottom: 4px;
  z-index: 1;
  display: flex;
  justify-content: space-between;
`;

export const TemplateIcon = styled.div`
  display: flex;
`;

export const Author = styled(UserWithAvatar)`
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  color: #777788;
`;

export const Stats = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  font-family: 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;

  color: ${props => props.theme.placeholder};

  li:not(:last-child) {
    margin-right: 8px;
  }

  li {
    display: flex;
    align-items: center;

    svg {
      margin-right: 6px;
      width: 16px;
      color: ${props => props.theme.placeholder.darken(0.3)};
    }
  }
`;

export const Avatar = styled.img`
  width: 1rem;
  height: 1rem;
  border-radius: 4px;
`;

export const SandboxStats = styled.div`
  display: flex;
  padding: 0.75rem;
  justify-content: space-between;
`;

export const Image = styled.div`
  position: relative;
  font-size: 10px;
`;
