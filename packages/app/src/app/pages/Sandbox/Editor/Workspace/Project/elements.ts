import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import Question from 'react-icons/lib/go/question';
import EditPenIcon from 'react-icons/lib/md/create';

export const Container = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

export const BasicInfo = styled.div`
  margin: 1rem;
  margin-top: 0;
  font-size: 0.875rem;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
  margin-top: 0;
  font-size: 0.875rem;
`;

export const Group = styled.div`
  margin-top: 2rem;
`;

export const PropertyName = styled.span`
  ${({ theme }) => css`
    display: inline-flex;
    align-items: center;
    flex: 0 0 110px;
    width: 110px;
    margin-right: 0.5rem;
    color: ${theme.light ? css`#6c6c6c` : css`rgba(255, 255, 255, 0.4)`};
    font-weight: 600;
    text-transform: uppercase;
  `}
`;

export const PropertyValue = styled.span<{ relative?: boolean }>`
  ${({ theme, relative }) => css`
    display: inline-block;
    position: ${relative ? 'relative' : 'initial'};
    flex: 1;
    color: ${theme.templateColor};
    text-align: right;
  `}
`;

export const PrivacySelect = styled.select`
  ${({ theme }) => css`
    width: 100%;
    /* Same size as other items */
    height: 20px;
    border: none;
    border-radius: 4px;
    background-color: ${theme[`dropdown.background`] ||
      css`rgba(0, 0, 0, 0.3)`};
    box-sizing: border-box;
    color: ${theme[`dropdown.foreground`] ||
      (theme.light ? css`rgba(0, 0, 0, 0.8)` : css`rgba(255, 255, 255, 0.8)`)};

    &:disabled {
      opacity: 0.5;
    }
  `}
`;

export const PatronMessage = styled.div`
  ${({ theme }) => css`
    color: ${theme.light ? css`rgba(0, 0, 0, 0.6)` : theme.placeholder};
    font-size: 0.875rem;
  `}
`;

export const UserLink = styled(Link)`
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
  display: flex;
  font-size: 0.75rem;
  opacity: 0.5;
  margin-left: 0.5em;
  cursor: pointer;
`;

export const TemplateStyledLink = styled(Link)`
  ${({ theme }) => css`
    color: ${theme.templateColor} !important;
  `}
`;

export const BundlerLink = styled.a.attrs({
  target: '_blank',
  rel: 'noreferrer noopener',
})`
  ${({ theme }) => css`
    color: ${theme.templateColor} !important;
  `}
`;

export const Explanation = styled.span`
  ${({ theme }) => css`
    display: block;
    padding-top: 5px;
    margin: 1rem;
    margin-top: -20px;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.4)`
      : css`rgba(255, 255, 255, 0.4)`};
    font-size: 12px;
  `}
`;
