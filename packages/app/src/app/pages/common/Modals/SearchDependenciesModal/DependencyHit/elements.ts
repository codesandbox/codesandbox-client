import styled, { css } from 'styled-components';
import BaseLicenseIcon from 'react-icons/lib/go/law';
import CloudDownloadIcon from 'react-icons/lib/go/cloud-download';
import { Highlight } from 'react-instantsearch/dom';
import Select from '@codesandbox/common/lib/components/Select';
import { Button } from '@codesandbox/common/lib/components/Button';
import { UserWithAvatar } from '@codesandbox/common/lib/components/UserWithAvatar';
import Color from 'color';

import GitHubLogo from 'app/components/GitHubLogo';

export const GitHubLogoStyled = styled(GitHubLogo)`
  ${({ theme }) => css`
    color: ${!theme.light ? css`inherit` : css`rgba(255, 255, 255, 0.8)`};
  `}
`;

export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    background-color: ${theme['sideBar.background']};
    color: ${theme.light ? css`rgba(0, 0, 0, 1)` : css`rgba(255, 255, 255, 1)`};

    &:not(:last-child) {
      border-bottom: 1px solid
        ${Color(theme[`sideBar.background`])
          .darken(0.4)
          .rgbString()};
    }
  `}
`;

const Column = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 8px 10px;
`;

export const Left = styled(Column)`
  ${({ highlighted, theme }: { highlighted: boolean; theme: any }) => css`
    width: 70%;
    background-color: ${highlighted
      ? Color(theme['sideBar.background'])
          .darken(0.2)
          .rgbString()
      : theme['sideBar.background']};
    cursor: pointer;

    &:hover {
      background-color: ${Color(theme[`sideBar.background`])
        .darken(0.2)
        .rgbString()};
    }
  `}
`;

export const Right = styled(Column)`
  align-items: flex-end;
  width: 30%;
`;

export const Row = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 8px;
`;

export const AlignBottom = styled(Row)`
  align-self: flex-end;
`;

export const AlignRight = styled(Row)`
  justify-content: flex-end;
`;

export const Description = styled(Row)`
  ${({ theme }) => css`
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.6)`
      : css`rgba(255, 255, 255, 0.6)`};
    font-size: 0.875rem;
  `}
`;

export const Name = styled(Highlight).attrs({
  attribute: 'name',
})`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  line-height: 24px;
`;

export const Downloads = styled.span`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    padding-left: 10px;
    color: ${theme[`panelTitle.inactiveForeground`]};
    font-weight: 500;
    font-size: 0.9rem;
    line-height: 24px;
  `}
`;

export const DownloadIcon = styled(CloudDownloadIcon)`
  padding-right: 6px;
`;

export const LicenseIcon = styled(BaseLicenseIcon)`
  padding-right: 6px;
`;

export const License = styled.span`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    padding-left: 10px;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.6)`
      : css`rgba(255, 255, 255, 0.6)`};
    font-size: 0.9rem;
    line-height: 24px;
  `}
`;

export const IconLink = styled.a.attrs({
  rel: 'noopener noreferrer',
  target: '_blank',
})`
  ${({ theme }) => css`
    padding-left: 10px;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
    font-size: 1rem;
    line-height: 24px;
  `}
`;

export const StyledSelect = styled(Select)`
  width: 100%;
  font-size: 0.875rem;
  cursor: pointer;
`;

export const StyledUserWithAvatar = styled(UserWithAvatar)`
  font-size: 0.75rem;
  font-weight: 500;
`;

export const AddButton = styled(Button).attrs({
  type: 'button',
})`
  font-size: 0.65rem;
`;
