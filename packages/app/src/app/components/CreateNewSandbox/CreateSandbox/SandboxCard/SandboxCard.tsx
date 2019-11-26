import React from 'react';
import { Icons } from '@codesandbox/template-icons';
import history from 'app/utils/history';
import getColorIcons from '@codesandbox/common/lib/templates/icons';
import getEnvironment, {
  TemplateType,
} from '@codesandbox/common/lib/templates';

import { useOvermind } from 'app/overmind';

import {
  Container,
  Icon,
  Details,
  Row,
  Title,
  Environment,
  Author as Detail,
  // ActionButton,
} from './elements';

interface ISandboxCardProps {
  title: string;
  owner: string | undefined;
  iconUrl: string;
  environment: TemplateType;
  url: string;
  color: string;
  templateId: string;
  sandboxId: string;
  official?: boolean;
  mine?: boolean;
  focused?: boolean;
  detailText?: string;
}

export const SandboxCard: React.FC<ISandboxCardProps> = ({
  title,
  iconUrl,
  environment,
  url,
  official,
  color,
  focused,
  detailText,
}) => {
  const UserIcon: React.FunctionComponent =
    iconUrl && Icons[iconUrl] ? Icons[iconUrl] : getColorIcons(environment);
  const OfficialIcon: React.FunctionComponent = getColorIcons(environment);
  const parsedEnvironment = getEnvironment(environment);

  const { actions } = useOvermind();

  const elRef = React.useRef<HTMLAnchorElement>();

  React.useEffect(() => {
    const inputHasFocus =
      document.activeElement && document.activeElement.tagName === 'INPUT';
    if (focused && elRef.current && !inputHasFocus) {
      elRef.current.focus();
    }
  }, [focused]);

  const openSandbox = (openNewWindow = false) => {
    if (openNewWindow === true) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }

    return actions.modalClosed();
  };

  return (
    <>
      <Container
        ref={elRef}
        to={url}
        onClick={event => {
          const cmd = event.ctrlKey || event.metaKey;
          openSandbox(Boolean(cmd));
        }}
        focused={focused}
        tabIndex={focused ? '0' : '-1'}
      >
        <Icon color={color}>
          {official && OfficialIcon ? <OfficialIcon /> : <UserIcon />}
        </Icon>
        <Details>
          <Row>
            <Title>{title}</Title>
          </Row>
          <Row>
            <Environment>{parsedEnvironment.name}</Environment>
            {detailText && <Detail>{detailText}</Detail>}
          </Row>
        </Details>
      </Container>
    </>
  );
};
