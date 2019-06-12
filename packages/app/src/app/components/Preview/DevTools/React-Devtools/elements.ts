import styled from 'styled-components';
import ChevronRight from 'react-icons/lib/md/chevron-right';

export const Container = styled.div`
  background-color: ${props =>
    props.theme['panel.background'] || props.theme.background2};
  width: 100%;
  height: 100%;
  color: ${props =>
    props.theme['editor.foreground'] || 'rgba(255, 255, 255, 0.8)'};
`;

export const File = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background-color: ${props =>
    props.theme.light ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};

  cursor: pointer;
`;

export const Path = styled.span`
  color: ${props =>
    props.theme['editor.foreground'] || 'rgba(255, 255, 255, 0.8)'};

  opacity: 0.75;
`;

export const FileName = styled.span`
  color: ${props =>
    props.theme['editor.foreground'] || 'rgba(255, 255, 255, 0.8)'};

  flex: 1;
`;

export const Actions = styled.div`
  transition: 0.3s ease opacity;
  font-size: 1.125rem;

  color: white;

  svg {
    margin-left: 0.5rem;
    transition: 0.3s ease color;

    color: rgba(255, 255, 255, 0.6);

    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }
`;

export const AnimatedChevron = styled(ChevronRight)<{ show: boolean }>`
  transition: 0.3s ease transform;
  transform: rotateZ(${props => (props.show ? 90 : 0)}deg);
  margin-right: 0.25rem;
`;

export const MessageContainer = styled.div`
  transition: 0.3s ease background-color;
  display: flex;
  align-items: center;
  padding: 0.25rem 1.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme['editor.foreground'] || 'white'};
  cursor: pointer;

  &:hover {
    background-color: ${props =>
      props.theme['list.hoverBackground'] || props.theme.background};
  }
`;

export const MessageIconContainer = styled.div`
  display: inline-flex;
  margin-right: 0.5rem;
  font-size: 0.75rem;
`;

export const MessageSource = styled.div`
  color: rgba(255, 255, 255, 0.6);
  margin-left: 1.5rem;
`;
