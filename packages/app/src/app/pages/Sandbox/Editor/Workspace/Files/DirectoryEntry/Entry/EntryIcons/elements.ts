import styled, { component } from 'app/styled-components';

// @ts-ignore
import jsSvg from 'common/components/icons/js.svg';
// @ts-ignore
import tsSvg from 'common/components/icons/ts.svg';
// @ts-ignore
import cssSvg from 'common/components/icons/css.svg';
// @ts-ignore
import reactSvg from 'common/components/icons/react.svg';
// @ts-ignore
import folderSvg from 'common/components/icons/folder.svg';
// @ts-ignore
import folderOpenSvg from 'common/components/icons/folder-open.svg';
// @ts-ignore
import jsonSvg from 'common/components/icons/json.svg';
// @ts-ignore
import yarnSvg from 'common/components/icons/yarn.svg';
// @ts-ignore
import markdownSvg from 'common/components/icons/markdown.svg';
// @ts-ignore
import faviconSvg from 'common/components/icons/favicon.svg';
// @ts-ignore
import htmlSvg from 'common/components/icons/html.svg';
// @ts-ignore
import npmSvg from 'common/components/icons/npm.svg';
// @ts-ignore
import vueSvg from 'common/components/icons/vue.svg';
// @ts-ignore
import fileSvg from 'common/components/icons/file.svg';
// @ts-ignore
import svgSvg from 'common/components/icons/svg.svg';
// @ts-ignore
import imageSvg from 'common/components/icons/image.svg';
// @ts-ignore
import prettierSvg from 'common/components/icons/prettier.svg';
// @ts-ignore
import codesandboxSvg from 'common/components/icons/codesandbox.svg';
// @ts-ignore
import babelSvg from 'common/components/icons/babel.svg';
// @ts-ignore
import sassSvg from 'common/components/icons/sass.svg';

const icons = {
  'directory': folderSvg,
  'directory-open': folderOpenSvg,
  'react': reactSvg,
  'css': cssSvg,
  'json': jsonSvg,
  'yarn': yarnSvg,
  'md': markdownSvg,
  'favicon': faviconSvg,
  'html': htmlSvg,
  'npm': npmSvg,
  'vue': vueSvg,
  'js': jsSvg,
  'ts': tsSvg,
  'svg': svgSvg,
  'image': imageSvg,
  'prettier': prettierSvg,
  'codesandbox': codesandboxSvg,
  'babel': babelSvg,
  'sass': sassSvg,
};

function getIconSvg(type) {
  return icons[type] || fileSvg;
}

export const RedIcon = styled.span`
  color: ${props => props.theme.red};
`;

export const SVGIcon = styled(component<{
  type: string
  width: number
  height: number
}>('span'))`
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
