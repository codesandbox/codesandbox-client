import styled from 'styled-components';
import Color from 'color';
import Select from '@codesandbox/common/lib/components/Select';
import { UserWithAvatar } from '@codesandbox/common/lib/components/UserWithAvatar';
import { GitHubLogo } from 'app/components/GitHubLogo';

export const GitHubLogoStyled = styled(GitHubLogo)`
  color: ${props =>
    !props.theme.light ? 'inherit' : 'rgba(255, 255, 255, 0.8)'};
`;

const getContainerColor = props => {
  if (props.highlighted) {
    return Color(props.theme['sideBar.background'])
      .darken(0.2)
      .rgbString();
  }

  return props.theme['sideBar.background'];
};

export const Container = styled.div`
  display: flex;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'};
  background-color: ${getContainerColor};
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid
      ${props =>
        Color(props.theme['sideBar.background'])
          .darken(0.4)
          .rgbString()};
  }

  &:hover {
    background-color: ${props =>
      Color(props.theme['sideBar.background'])
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
    props.theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'};
`;

export const Downloads = styled.span`
  color: ${props => props.theme['panelTitle.inactiveForeground']};
  font-weight: 500;
  font-size: 12px;
`;

export const License = styled.span`
  border: 1px solid
    ${props =>
      !props.theme.light ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
  border-radius: 3px;
  padding: 1px 3px;

  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 12px;
`;

export const IconLink = styled.a`
  font-size: 1rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
`;

export const StyledSelect = styled(Select)`
  font-size: 0.875rem;
`;

export const StyledUserWithAvatar = styled(UserWithAvatar)`
  font-size: 0.75rem;
  font-weight: 500;
`;
