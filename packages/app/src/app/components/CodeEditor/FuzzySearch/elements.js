import styled, { css } from 'styled-components';
import NotSyncedIcon from 'react-icons/lib/go/primitive-dot';

export const Container = styled.div`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;

  z-index: 60;

  margin: auto;
  padding-bottom: 0.25rem;

  background-color: ${props => props.theme.background};

  max-width: 650px;
  width: 100%;

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.6);
`;

export const InputContainer = styled.div`
  padding: 0.5rem;
  input {
    width: 100%;
  }
`;

export const Items = styled.div`
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const Entry = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;

  ${({ isNotSynced }) =>
    isNotSynced &&
    css`
      padding-left: 2rem;
    `};
  color: rgba(255, 255, 255, 0.8);

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: ${props => props.theme.secondary.clearer(0.7)};
    `};
`;

export const NotSyncedIconWithMargin = styled(NotSyncedIcon)`
  position: absolute;
  left: 0.75rem;
  top: 0;
  color: ${props => props.theme.templateColor || props.theme.secondary};
  vertical-align: middle;

  margin-top: 6px;
`;

export const CurrentModuleText = styled.div`
  position: absolute;
  right: 0.75rem;
  font-weight: 500;
  color: ${props => props.theme.secondary};
`;

export const Name = styled.span`
  margin: 0 0.5rem;
`;

export const Path = styled.span`
  margin: 0 0.25rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
`;
