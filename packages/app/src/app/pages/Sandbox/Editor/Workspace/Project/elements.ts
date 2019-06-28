import styled, { css, CSSProp } from 'styled-components';
import Question from 'react-icons/lib/go/question';
import EditPenIcon from 'react-icons/lib/md/create';
import { Link } from 'react-router-dom';

export const Item = styled.div<{ flex?: boolean }>`
  ${({ flex }) => css`
    ${flex && 'display: flex'};
    margin: 1rem;
    margin-top: 0;
    font-size: 0.875rem;
  `}
`;

export const PropertyName = styled.span`
  ${({ theme }) => css`
    display: inline-block;
    flex: 0 0 110px;
    width: 110px;
    margin-right: 0.5rem;
    color: ${theme.light ? css`#6c6c6c` : css`rgba(255, 255, 255, 0.4)`};
    font-weight: 600;
    text-transform: uppercase;
  `}
`;

export const PropertyValue = styled.span`
  ${({ theme }) => css`
    display: inline-block;
    flex: 1;
    color: ${theme.templateColor};
    text-align: right;
  `}
`;

export const PrivacySelect = styled.select`
  ${({ theme }) => css`
    width: 100%;
    height: 2rem;
    border: none;
    border-radius: 4px;
    background-color: ${theme[`dropdown.background`] ||
      css`rgba(0, 0, 0, 0.3)`};
    box-sizing: border-box;
    color: ${theme[`dropdown.foreground`] ||
      (theme.light ? css`rgba(0, 0, 0, 0.8)` : css`rgba(255, 255, 255, 0.8)`)};
  `}
`;

export const PatronMessage = styled.div`
  ${({ theme }) => css`
    color: ${theme.light ? css`rgba(0, 0, 0, 0.6)` : theme.placeholder};
    font-size: 0.875rem;
  `}
`;

export const UserLink = styled.span`
  ${({ theme }) => css`
    display: block;
    color: ${theme[`editor.foreground`] || css`rgba(255, 255, 255, 0.8)`};
    font-size: 0.875rem;
    text-decoration: none;
  `}
`;

export const StatsContainer = styled(Item)`
  ${({ theme }) => css`
    height: 1.5rem;
    margin-left: 1rem;
    box-sizing: border-box;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
    font-size: 0.875rem;
  `}
`;

export const PrivacyContainer = styled.span`
  ${({ theme }) => css`
    margin-bottom: 1rem;
    color: ${theme.templateColor};
    font-size: 0.875rem;
  `}
`;

export const FreezeContainer = styled.span`
  display: flex;
  justify-content: flex-end;
`;

export const TemplateColor = styled.span`
  ${({ theme }) => css`
    color: ${theme.templateColor};
  `}
`;

export const EditPen = styled(EditPenIcon)`
  ${({ theme }) => css`
    margin-left: 0.5rem;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.5)`
      : css`rgba(255, 255, 255, 0.5)`};
    transition: 0.3s ease color;
    cursor: pointer;

    &:hover {
      color: ${theme.light ? css`#636363` : css`white`};
    }
  `}
`;

export const Icon = styled(Question)`
  opacity: 0.5;
  margin-left: 0.5em;
`;

export const BundlerLink = styled.a.attrs<{ color: string }>({
  target: '_blank',
  rel: 'noreferrer noopener',
})`
  ${({ color }) => css`
    color: ${color};
  `}
`;
