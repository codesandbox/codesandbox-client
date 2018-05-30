// @ts-check
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import history from 'app/utils/history';
import { sandboxUrl } from 'common/utils/url-generator';

import ContextMenu from 'app/components/ContextMenu';

import {
  Container,
  SandboxImageContainer,
  SandboxImage,
  SandboxInfo,
  SandboxDetails,
} from './elements';

type Props = {
  id: string,
  title: string,
  details: string,
  selected: boolean,
  setSandboxesSelected: (ids: string[]) => void,
};

export const PADDING = 32;

export default class SandboxItem extends React.PureComponent<Props> {
  el: HTMLDivElement;

  componentDidMount() {
    if (this.props.selected) {
      if (this.el && typeof this.el.focus === 'function') {
        this.el.focus();
      }
    }
  }

  selectSandbox = () => {
    this.props.setSandboxesSelected([this.props.id]);
  };

  openSandbox = () => {
    // Git sandboxes aren't shown here anyway
    history.push(sandboxUrl({ id: this.props.id }));

    return true;
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // enter
      this.openSandbox();
    }
  };

  handleOnClick = this.selectSandbox;
  handleOnContextMenu = this.selectSandbox;
  handleOnFocus = this.selectSandbox;

  render() {
    const { style, id, title, details } = this.props;

    return (
      <ContextMenu
        style={{
          ...style,
          paddingRight: PADDING,
          boxSizing: 'border-box',
        }}
        id={id}
        className="sandbox-item"
        ref={el => {
          this.el = el;
        }}
        items={[
          {
            title: 'Open Sandbox',
            action: this.openSandbox,
          },
        ]}
      >
        <Container
          style={{ outline: 'none' }}
          onContextMenu={this.handleOnContextMenu}
          onClick={this.handleOnClick}
          onDoubleClick={this.openSandbox}
          onFocus={this.handleOnFocus}
          onKeyDown={this.handleKeyDown}
          role="button"
          tabIndex={0}
          selected={this.props.selected}
        >
          <SandboxImageContainer>
            <SandboxImage
              style={{
                backgroundImage: `url(${`/api/v1/sandboxes/${id}/screenshot.png`})`,
              }}
            />
          </SandboxImageContainer>
          <SandboxInfo>
            <div>{title}</div>
            <SandboxDetails>{details}</SandboxDetails>
          </SandboxInfo>
        </Container>
      </ContextMenu>
    );
  }
}
