import React from 'react';
import styled from 'styled-components';

import { fadeIn } from '../../../utils/animation';

import babelSvg from './babel.png';
import cssSvg from './css.png';
import htmlSvg from './html.png';
import pugSvg from './pug.png';
import imageSvg from './image.png';
import lessSvg from './less.png';
import scssSvg from './scss.png';
import stylusSvg from './stylus.png';
import typescriptSvg from './typescript.png';
import vueSvg from './vue.png';

const Container = styled.div`
  display: flex;
  align-items: center;

  ${props => fadeIn(props.i * 0.1)};
  img {
    display: inline-block;
    margin-bottom: 0;
  }
`;

export default ({ iconSrc, title, extension, ...props }) => (
  <Container {...props}>
    <img width={20} height={20} src={iconSrc} alt={title} />
    <span>.{extension}</span>
  </Container>
);

export const js = { svg: babelSvg, title: 'babel', extension: 'js' };
export const ts = { svg: typescriptSvg, title: 'typescript', extension: 'ts' };
export const scss = { svg: scssSvg, title: 'scss', extension: 'scss' };
export const sass = { svg: scssSvg, title: 'sass', extension: 'sass' };
export const less = { svg: lessSvg, title: 'less', extension: 'less' };
export const stylus = { svg: stylusSvg, title: 'stylus', extension: 'styl' };
export const image = { svg: imageSvg, title: 'image', extension: 'png' };
export const html = { svg: htmlSvg, title: 'html', extension: 'html' };
export const pug = { svg: pugSvg, title: 'pug', extension: 'pug' };
export const cssGlobal = { svg: cssSvg, title: 'css', extension: 'css' };
export const vue = { svg: vueSvg, title: 'vue', extension: 'vue' };
