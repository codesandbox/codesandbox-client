import styled, { css } from 'styled-components';
import Question from 'react-icons/lib/go/question';
import EditPenIcon from 'react-icons/lib/md/create';

import { Link } from 'react-router-dom';

export const Item = styled.div<{ flex?: boolean; css?: any }>`
  margin: 1rem;
  margin-top: 0;
  font-size: 0.875rem;

  ${props => props.flex && 'display: flex'};
`;

export const PrivacySelect = styled.select`
  background-color: ${props =>
    props.theme['dropdown.background'] || 'rgba(0, 0, 0, 0.3)'};
  color: ${props =>
    props.theme['dropdown.foreground'] ||
    (props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  border-radius: 4px;
  height: 2rem;
  width: 100%;
  border: none;
  box-sizing: border-box;
`;

export const PatronMessage = styled.div`
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.6)' : props.theme.placeholder};
  font-size: 0.875rem;
`;

export const UserLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: ${props =>
    props.theme['editor.foreground'] || 'rgba(255, 255, 255, 0.8)'};
  font-size: 0.875rem;
`;

export const StatsContainer = styled(Item)`
  height: 1.5rem;
  font-size: 0.875rem;
  box-sizing: border-box;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  margin-left: 1rem;
`;

export const PrivacyContainer = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.templateColor};
  margin-bottom: 1rem;
`;

export const FreezeContainer = styled.span`
  display: flex;
  justify-content: flex-end;
`;

export const PropertyName = styled.span<{ css?: any }>`
  display: inline-block;
  color: ${props =>
    props.theme.light ? '#6c6c6c' : 'rgba(255, 255, 255, 0.4)'};
  font-weight: 600;
  margin-right: 0.5rem;
  width: 110px;
  text-transform: uppercase;
  flex: 0 0 110px;
`;

export const PropertyValue = styled.span`
  display: inline-block;
  color: ${props => props.theme.templateColor};
  text-align: right;
  flex: 1;
`;

export const TemplateColor = styled.span`
  color: ${props => props.theme.templateColor};
`;

export const EditPen = styled(EditPenIcon)`
  transition: 0.3s ease color;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  margin-left: 0.5rem;

  &:hover {
    color: ${props => (props.theme.light ? '#636363' : 'white')};
  }
`;

export const Icon = styled(Question)`
  opacity: 0.5;
  margin-left: 0.5em;
`;
