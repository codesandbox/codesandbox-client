import React from 'react';
import { Icons } from '@codesandbox/template-icons';
import getColorIcons from '@codesandbox/common/lib/templates/icons';
import getEnvironment, {
  TemplateType,
} from '@codesandbox/common/lib/templates';

import {
  Container,
  Icon,
  Details,
  Row,
  Title,
  Environment,
  Author as Detail,
} from './elements';

interface ISandboxCardProps {
  title: string;
  iconUrl: string;
  environment: TemplateType;
  color: string;
  official?: boolean;
  focused?: boolean;
  detailText?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  DetailComponent?: React.FunctionComponent;
}

export const SandboxCard: React.FC<ISandboxCardProps> = ({
  title,
  iconUrl,
  environment,
  official,
  color,
  focused,
  detailText,
  onClick,
  onFocus,
  onKeyPress,
  DetailComponent,
}) => {
  const UserIcon: React.FunctionComponent =
    iconUrl && Icons[iconUrl] ? Icons[iconUrl] : getColorIcons(environment);
  const OfficialIcon: React.FunctionComponent = getColorIcons(environment);
  const parsedEnvironment = getEnvironment(environment);

  const elRef = React.useRef<HTMLButtonElement>();

  React.useEffect(() => {
    const inputHasFocus =
      document.activeElement && document.activeElement.tagName === 'INPUT';
    if (focused && elRef.current && !inputHasFocus) {
      elRef.current.focus();
    }
  }, [focused]);

  return (
    <Container
      ref={elRef}
      onClick={onClick}
      onMouseOver={() => {
        // Set focus to current element
        elRef.current.focus();
      }}
      onFocus={onFocus}
      onKeyPress={onKeyPress}
      tabIndex={focused ? 0 : -1}
      focused={focused}
    >
      <Icon color={color}>
        {official && OfficialIcon ? <OfficialIcon /> : <UserIcon />}
      </Icon>
      <Details>
        <Row>
          <Title>{title}</Title>

          {focused && DetailComponent && <DetailComponent />}
        </Row>
        <Row>
          <Environment>{parsedEnvironment.name}</Environment>

          {detailText && <Detail>{detailText}</Detail>}
        </Row>
      </Details>
    </Container>
  );
};
