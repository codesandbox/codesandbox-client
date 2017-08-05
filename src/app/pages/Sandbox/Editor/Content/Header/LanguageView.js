import React from 'react';
import styled from 'styled-components';
import GlobeIcon from 'react-icons/lib/fa/globe';
import Button from 'app/components/buttons/Button';
import theme from 'common/theme';
import i18n, { languageList } from 'common/i18n';
import { translate } from 'react-i18next';

import HoverMenu from './HoverMenu';
import Action from './Action';

const Container = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
`;

const ListView = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  z-index: 2;
  width: 200px;
  border-radius: 4px;
  font-size: .875rem;
  color: rgba(255, 255, 255, 0.8);

  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  background-color: ${props => props.theme.background2};
`;

const LanguageItem = styled.div`
  padding: 0.6rem 1rem;
  cursor: pointer;
  ${props =>
    props.active &&
    `color: ${theme.white()} !important;
      border-color: ${theme.primary()} !important;
      background-color: ${theme.primary
        .lighten(0.1)
        .clearer(0.8)()} !important;`}

   &:hover {
      ${props =>
        props.active
          ? ``
          : `
        background-color: ${theme.secondary.clearer(0.9)()};
        color: ${theme.background.lighten(5)()};
        border-color: ${theme.secondary.darken(0.4)()};
      `}

      > div {
        opacity: 1; !important
      }
    }
`;

function isCurrentLanguage(code: string) {
  return i18n.language === code;
}

const changeLanguage = (code: string) => () => {
  i18n.changeLanguage(code);
};

type Props = {
  t: Function,
};

export default translate('editor')(({ t }: Props) =>
  <Container>
    <HoverMenu
      HeaderComponent={Action}
      headerProps={{
        Icon: GlobeIcon,
        tooltip: t('tooltip.language'),
      }}
    >
      {() =>
        <ListView>
          {languageList.map(({ code, text }) =>
            <LanguageItem
              key={code}
              active={isCurrentLanguage(code)}
              onClick={changeLanguage(code)}
            >
              {text}
            </LanguageItem>,
          )}
        </ListView>}
    </HoverMenu>
  </Container>,
);
