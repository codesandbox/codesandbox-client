import styled from 'styled-components';

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
import prettierSvg from 'common/components/icons/prettier.svg';
import codesandboxSvg from 'common/components/icons/codesandbox.svg';
import babelSvg from 'common/components/icons/babel.svg';
import sassSvg from 'common/components/icons/sass.svg';

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
  prettier: prettierSvg,
  codesandbox: codesandboxSvg,
  babel: babelSvg,
  sass: sassSvg,
};

function getIconSvg(type) {
  return icons[type] || fileSvg;
}

export const RedIcon = styled.span`
  color: ${props => props.theme.red};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

export const SVGIcon = styled.span`
  background-image: url(${props => getIconSvg(props.type)});
  background-size: ${props => props.width}px;
  background-position: 0;
  background-repeat: no-repeat;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  vertical-align: top;
  flex-shrink: 0;
`;
