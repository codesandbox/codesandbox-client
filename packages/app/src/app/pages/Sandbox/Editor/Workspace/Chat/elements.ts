import styled, { css } from 'styled-components';
import AutosizeTextArea from '@codesandbox/common/lib/components/AutosizeTextArea';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 200px;
  max-height: 300px;
  padding: 0 1rem;
  color: white;
  font-size: 0.875rem;
  overflow-y: auto;
`;

export const Messages = styled.div`
  flex: 1;
  height: 100%;
`;

export const User = styled.div`
  ${({ color }) => css`
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
    color: ${color};
    font-weight: 600;
  `}
`;

export const Message = styled.div`
  margin-bottom: 0.25rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
`;

export const NoMessages = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
`;

export const ChatInput = styled(AutosizeTextArea)`
  ${({ height }) => css`
    width: 100%;
    min-height: ${height};
    margin-top: 0.5rem;
  `}
`;
