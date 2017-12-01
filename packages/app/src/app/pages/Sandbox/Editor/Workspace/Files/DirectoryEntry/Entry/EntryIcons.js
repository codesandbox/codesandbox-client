import React from 'react';
import styled from 'styled-components';

import ErrorIcon from 'react-icons/lib/md/error';

import jsSvg from 'common/components/icons/js.svg';
import tsSvg from 'common/components/icons/ts.svg';
import cssSvg from 'common/components/icons/css.svg';
import reactSvg from 'common/components/icons/react.svg';
import folderSvg from 'common/components/icons/folder.svg';
import folderOpenSvg from 'common/components/icons/folder-open.svg';
import jsonSvg from 'common/components/icons/json.svg';
import yarnSvg from 'common/components/icons/yarn.svg';
import markdownSvg from 'common/components/icons/markdown.svg';
import faviconSvg from 'common/components/icons/favicon.svg';
import htmlSvg from 'common/components/icons/html.svg';
import npmSvg from 'common/components/icons/npm.svg';
import vueSvg from 'common/components/icons/vue.svg';
import fileSvg from 'common/components/icons/file.svg';
import svgSvg from 'common/components/icons/svg.svg';
import imageSvg from 'common/components/icons/image.svg';

const icons = {
  directory: folderSvg,
  'directory-open': folderOpenSvg,
  react: reactSvg,
  css: cssSvg,
  json: jsonSvg,
  yarn: yarnSvg,
  md: markdownSvg,
  favicon: faviconSvg,
  html: htmlSvg,
  npm: npmSvg,
  vue: vueSvg,
  js: jsSvg,
  ts: tsSvg,
  svg: svgSvg,
  image: imageSvg,
};

function getIconSvg(type) {
  return icons[type] || fileSvg;
}

const RedIcon = styled.span`
  color: ${props => props.theme.red};
`;

const SVGIcon = styled.span`
  background-image: url(${props => getIconSvg(props.type)});
  background-size: 1rem;
  background-position: 0;
  background-repeat: no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  vertical-align: top;
  flex-shrink: 0;
`;

const getIcon = (type, error) => {
  if (error) {
    return (
      <RedIcon>
        <ErrorIcon />
      </RedIcon>
    );
  }

  return <SVGIcon type={type} />;
};

type Props = {
  type: string,
  error: boolean,
};
export default function EntryIcon({ type, error }: Props) {
  return (
    <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {getIcon(type, error)}
    </div>
  );
}

EntryIcon.defaultProps = {
  isOpen: false,
};
