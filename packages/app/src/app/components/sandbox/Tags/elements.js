import styled, { css } from 'styled-components';

export const TagContainer = styled.div`
  margin: 0.75em;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  ${props => props.align === 'right' && `justify-content: flex-end;`};
`;
import CrossIcon from 'react-icons/lib/md/clear';

export const Container = styled.span`
  position: relative;
  color: white;
  background-color: ${props => props.theme.secondary};
  padding: 0.3em 0.5em;
  border-radius: 4px;
  font-weight: 500;

  ${props =>
    props.canRemove &&
    css`
      padding-right: 1.5rem;
    `};
`;

export const DeleteIcon = styled(CrossIcon)`
  transition: 0.3s ease all;
  position: absolute;
  right: 0.3rem;
  top: 0;
  bottom: 0;

  margin: auto;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);

  &:hover {
    color: white;
  }
`;
