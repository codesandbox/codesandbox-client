import styled, { css } from 'styled-components';
import BaseQuestion from 'react-icons/lib/go/question';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  font-family: Inter;
  margin: 0 1rem;
  margin-bottom: 1rem;
`;

export const Title = styled.h1`
  font-style: normal;
  font-weight: bold;
  font-size: 13px;
  line-height: 16px;

  margin-top: 0;
  margin-bottom: 0.125rem;
  color: ${props =>
    props.theme.vscodeTheme.type === 'light' ? 'black' : 'white'};
`;

export const Environment = styled.a`
  font-size: 11px;
  color: ${props => props.theme['editor.foreground']};
  text-decoration: none;

  &:hover {
    color: ${props => (props.theme.light ? 'black' : 'white')};
  }
`;

export const Description = styled.p`
  font-weight: 300;
  font-size: 13px;
  color: ${props => props.theme['editor.foreground']};
`;

export const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const TemplateIconContainer = styled.div`
  display: flex;
  margin-left: 0.5rem;
  margin-right: 1rem;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  font-size: 13px;
`;

export const StyledLink = styled(Link)`
  ${({ theme }) => css`
    color: ${theme.light ? css`black` : css`white`};
  `}
`;

export const Group = styled.div`
  margin-top: 1.5rem;
`;

export const PropertyName = styled.span`
  ${({ theme }) => css`
    display: inline-flex;
    align-items: center;
    flex: 0 0 90px;
    width: 90px;
    margin-right: 0.5rem;
    color: ${theme.light ? css`black` : css`white`};
    font-weight: 400;
  `}
`;

export const PropertyValue = styled.span<{ relative?: boolean }>`
  ${({ theme, relative }) => css`
    display: inline-block;
    position: ${relative ? 'relative' : 'initial'};
    flex: 1;
    color: ${theme.light ? css`black` : css`white`};
    text-align: right;
  `}
`;

export const QuestionIcon = styled(BaseQuestion)`
  display: flex;
  font-size: 0.75rem;
  opacity: 0.5;
  margin-left: 0.5em;
  cursor: pointer;
`;
