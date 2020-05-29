import Select from '@codesandbox/common/es/components/Select';
import { UserWithAvatar } from '@codesandbox/common/es/components/UserWithAvatar';
import { GitHubLogo } from 'app/components/GitHubLogo';
import Color from 'color';
import styled from 'styled-components';

export const GitHubLogoStyled = styled(GitHubLogo)``;

const getContainerColor = props => {
  if (props.highlighted) {
    return Color(props.theme.colors.dialog.background)
      .darken(0.2)
      .rgbString();
  }

  return props.theme.colors.dialog.background;
};

export const Container = styled.div`
  display: flex;
  color: ${props => props.theme.colors.dialog.foreground};
  background-color: ${getContainerColor};
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid
      ${props =>
        Color(props.theme.colors.dialog.background)
          .darken(0.4)
          .rgbString()};
  }

  &:hover {
    background-color: ${props =>
      Color(props.theme.colors.dialog.background)
        .darken(0.2)
        .rgbString()};
  }
`;

export const Left = styled.div`
  flex: 1;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
`;

export const Row = styled.div`
  margin: 10px;
  & > * {
    margin-right: 10px;
  }
`;

export const Description = styled(Row)`
  font-size: 0.875rem;

  color: ${props =>
    Color(props.theme.colors.dialog.foreground)
      .alpha(0.6)
      .rgbString()};
`;

export const Downloads = styled.span`
  color: ${props => props.theme['panelTitle.inactiveForeground']};
  font-weight: 500;
  font-size: 12px;
`;

export const License = styled.span`
  border: 1px solid
    ${props =>
      Color(props.theme.colors.dialog.border)
        .alpha(0.4)
        .rgbString()};
  border-radius: 3px;
  padding: 1px 3px;

  color: ${props =>
    Color(props.theme.colors.dialog.foreground)
      .alpha(0.6)
      .rgbString()};
  font-size: 12px;
`;

export const IconLink = styled.a`
  font-size: 1rem;
  color: ${props =>
    Color(props.theme.colors.icon.foreground)
      .alpha(1)
      .rgbString()};

  ${GitHubLogoStyled} {
    circle {
      fill: transparent;
    }
  }
`;

export const StyledSelect = styled(Select)`
  font-size: 0.875rem;
`;

export const StyledUserWithAvatar = styled(UserWithAvatar)`
  font-size: 0.75rem;
  font-weight: 500;
`;
