import styled, { css } from 'styled-components';

import { UserWithAvatar } from '../UserWithAvatar';

export const BG_COLOR = '#151515';
export const BG_HOVER = '#242424';

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
  border: 1px solid ${BG_HOVER};

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
    transform: scale(1.05);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12), 0 4px 4px rgba(0, 0, 0, 0.24);
  }

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 2px rgba(0, 0, 0, 0.24);
  }

  &:last-child {
    flex-grow: 0;
    min-width: calc(33% - 1rem);
  }
`;

export const SandboxTitle = styled.h2`
  color: ${props => props.color};
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  max-height: 20px;
`;

export const SandboxDescription = styled.p`
  font-size: 0.8rem;
  color: #777788;
  font-weight: 500;
  line-height: 1.3;
  margin-top: 8px;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  max-height: 35px;
`;

export const SandboxImage = styled.img`
  display: block;
  margin-bottom: 0;
  z-index: 0;
  border-bottom: 3.2px solid ${props => props.color};
  height: auto;
  width: 100%;
  background-color: ${BG_HOVER};
  border-image-width: 0;
`;

export const SandboxInfo = styled.div<{ noHeight?: boolean }>`
  left: -1px;
  right: -1px;
  padding: 0.75rem;
  min-height: 90px;
  z-index: 1;
  height: 130px;

  ${props =>
    props.noHeight &&
    css`
      height: auto;
    `};
`;

export const TemplateIcon = styled.div`
  display: flex;

  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
`;

export const Author = styled(UserWithAvatar)`
  font-size: 0.75rem;
  font-weight: 600;

  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  text-decoration: none;
  color: #777788;
`;
