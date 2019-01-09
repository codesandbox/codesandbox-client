import styled, { css } from 'styled-components';
import Question from 'react-icons/lib/go/question';
import EditPenIcon from 'react-icons/lib/md/create';

import { Link } from 'react-router-dom';

export const Item = styled.div`
  margin: 1rem;
  margin-top: 0;
  font-size: 0.875rem;

  ${props => props.flex && 'display: flex'};
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

export const FreezeConatainer = styled.span`
  display: flex;
  justify-content: flex-end;
`;

export const Title = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: ${props => (props.theme.light ? '#636363' : 'white')};
  margin-bottom: 0.5rem;
`;

export const Description = styled.div`
  font-size: 0.875rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  margin-top: 0.5rem;
`;

export const PropertyName = styled.span`
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

const iconStyles = css`
  opacity: 0.5;
  margin-left: 0.5em;
`;

export const Icon = styled(Question)(iconStyles);
