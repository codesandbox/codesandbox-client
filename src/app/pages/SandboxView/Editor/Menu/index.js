import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import InfoIcon from 'react-icons/lib/go/comment';
import CodeIcon from 'react-icons/lib/go/code';
import VersionsIcon from 'react-icons/lib/go/versions';
import Libraries from 'react-icons/lib/go/book';
import {
  versionsUrl,
  editModuleUrl,
  sandboxDependenciesUrl,
  sandboxInfoUrl,
} from '../../../../utils/url-generator';
import type { Sandbox } from '../../../../store/entities/sandboxes/index';
import theme from '../../../../../common/theme';

const Container = styled.nav`
  display: flex;
  flex-direction: column;
  font-size: 2.5rem;
  background-color: ${props => props.theme.background2};
  border-right: 1px solid ${props => props.theme.background2};
  padding-top: 0.5rem;
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.background3};

  &:hover {
    color: ${props => props.theme.primary.clearer(0.5)()};
  }
`;

const Icon = styled.div`
  transition: 0.3s ease all;
  cursor: pointer;
  padding: 0 0.75rem;
  padding-bottom: 0.75rem;
`;

const activeStyle = {
  color: theme.primary(),
};

type Props = {
  sandbox: Sandbox;
};

const ITEMS = [
  {
    name: 'Sandbox Information',
    url: sandbox => sandboxInfoUrl(sandbox),
    icon: <InfoIcon />,
  },
  {
    name: 'Code Editor',
    url: sandbox => editModuleUrl(sandbox),
    icon: <CodeIcon />,
  },
  {
    name: 'Versions',
    url: sandbox => versionsUrl(sandbox),
    icon: <VersionsIcon />,
  },
  {
    name: 'Libraries',
    url: sandbox => sandboxDependenciesUrl(sandbox),
    icon: <Libraries />,
  },
];

export default class Menu extends React.PureComponent {
  props: Props;
  render() {
    const { sandbox } = this.props;
    return (
      <Container>
        {ITEMS.map(item => (
          <StyledLink
            key={item.name}
            to={item.url(sandbox)}
            activeStyle={activeStyle}
          >
            <Icon>
              {item.icon}
            </Icon>
          </StyledLink>
        ))}
      </Container>
    );
  }
}
