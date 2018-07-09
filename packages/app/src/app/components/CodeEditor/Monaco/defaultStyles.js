import { injectGlobal } from 'styled-components';

export default injectGlobal`
body {
.monaco-editor .minimap-slider,
.monaco-editor .minimap-slider .minimap-slider-horizontal {
  background: rgba(8, 77, 129, 0.25);
}

.monaco-editor .view-overlays .current-line { border:  none;}

.monaco-editor .minimap-slider:hover,
.monaco-editor .minimap-slider:hover .minimap-slider-horizontal {
  background: rgba(8, 77, 129, 0.25);
}
.monaco-editor .minimap-slider.active,
.monaco-editor .minimap-slider.active .minimap-slider-horizontal {
  background: rgba(8, 77, 129, 0.25);
}
.monaco-editor .minimap-shadow-visible {
  box-shadow: #010b14 -6px 0 6px -6px inset;
}
.monaco-editor .scroll-decoration {
  box-shadow: #010b14 0 6px 6px -6px inset;
}
.monaco-editor .focused .selected-text {
  background-color: #1d3b53;
}
.monaco-editor .selected-text {
  background-color: rgba(126, 87, 194, 0.35);
}
.monaco-editor,
.monaco-editor-background,
.monaco-editor .inputarea.ime-input {
  background-color: #011627;
}
.monaco-editor,
.monaco-editor .inputarea.ime-input {
  color: #d6deeb;
}
.monaco-editor .margin {
  background-color: #011627;
}
.monaco-editor .rangeHighlight {
  background-color: rgba(126, 87, 194, 0.35);
}
.vs-whitespace {
  color: rgba(227, 228, 226, 0.16) !important;
}
.monaco-editor .view-overlays .current-line {
  background-color: rgba(0, 0, 0, 0.2);
}
.monaco-editor .margin-view-overlays .current-line-margin {
  background-color: rgba(0, 0, 0, 0.2);
  border: none;
}
.monaco-editor .lines-content .cigr {
  box-shadow: 1px 0 0 0 rgba(94, 129, 206, 0.32) inset;
}
.monaco-editor .lines-content .cigra {
  box-shadow: 1px 0 0 0 #7e97ac inset;
}
.monaco-editor .line-numbers {
  color: #4b6479;
}
.monaco-editor .current-line ~ .line-numbers {
  color: #c5e4fd;
}
.monaco-editor .view-ruler {
  box-shadow: 1px 0 0 0 rgba(94, 129, 206, 0.32) inset;
}
.monaco-editor .cursor {
  background-color: #80a4c2;
  border-color: #80a4c2;
  color: #7f5b3d;
}
.monaco-editor .squiggly-error {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%206%203'%20enable-background%3D'new%200%200%206%203'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%23ef5350'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")
    repeat-x bottom left;
}
.monaco-editor .squiggly-warning {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%206%203'%20enable-background%3D'new%200%200%206%203'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%23b39554'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")
    repeat-x bottom left;
}
.monaco-editor .squiggly-info {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%206%203'%20enable-background%3D'new%200%200%206%203'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%23008000'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")
    repeat-x bottom left;
}
.monaco-editor .squiggly-hint {
  background: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%223%22%20width%3D%2212%22%3E%3Cg%20fill%3D%22rgba(238%2C%20238%2C%20238%2C%200.7)%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%2F%3E%3Ccircle%20cx%3D%225%22%20cy%3D%221%22%20r%3D%221%22%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%221%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')
    no-repeat bottom left;
}
.showUnused .monaco-editor .squiggly-inline-unnecessary {
  opacity: 0.667;
}
.monaco-diff-editor .diff-review-line-number {
  color: #4b6479;
}
.monaco-diff-editor .diff-review-shadow {
  box-shadow: #010b14 0 -6px 6px -6px inset;
}
.monaco-editor .line-insert,
.monaco-editor .char-insert {
  background-color: rgba(153, 183, 109, 0.14);
}
.monaco-diff-editor .line-insert,
.monaco-diff-editor .char-insert {
  background-color: rgba(153, 183, 109, 0.14);
}
.monaco-editor .inline-added-margin-view-zone {
  background-color: rgba(153, 183, 109, 0.14);
}
.monaco-editor .line-delete,
.monaco-editor .char-delete {
  background-color: rgba(239, 83, 80, 0.2);
}
.monaco-diff-editor .line-delete,
.monaco-diff-editor .char-delete {
  background-color: rgba(239, 83, 80, 0.2);
}
.monaco-editor .inline-deleted-margin-view-zone {
  background-color: rgba(239, 83, 80, 0.2);
}
.monaco-editor .line-insert,
.monaco-editor .char-insert {
  border: 1px solid rgba(173, 219, 103, 0.2);
}
.monaco-editor .line-delete,
.monaco-editor .char-delete {
  border: 1px solid rgba(239, 83, 80, 0.3);
}
.monaco-diff-editor.side-by-side .editor.modified {
  box-shadow: -6px 0 5px -5px #010b14;
}
.monaco-editor .bracket-match {
  background-color: rgba(95, 126, 151, 0.3);
}
.monaco-editor .bracket-match {
  border: 1px solid #888888;
}
.monaco-editor .codelens-decoration {
  color: rgba(94, 130, 206, 0.71);
}
.monaco-editor .codelens-decoration > a:hover {
  color: #4e94ce !important;
}
.monaco-editor .findOptionsWidget {
  background-color: #31364a;
}
.monaco-editor .findOptionsWidget {
  box-shadow: 0 2px 8px #011627;
}
.monaco-editor .findOptionsWidget {
  border: 2px solid #122d42;
}
.monaco-editor .hoverHighlight {
  background-color: rgba(126, 87, 194, 0.35);
}
.monaco-editor .monaco-editor-hover {
  background-color: #011627;
}
.monaco-editor .monaco-editor-hover {
  border: 1px solid #5f7e97;
}
.monaco-editor .monaco-editor-hover .hover-row:not(:first-child):not(:empty) {
  border-top: 1px solid rgba(95, 126, 151, 0.5);
}
.monaco-editor .monaco-editor-hover a {
  color: #4080d0;
}
.monaco-editor .monaco-editor-hover code {
  background-color: rgba(10, 10, 10, 0.4);
}
.monaco-editor.vs .valueSetReplacement {
  outline: solid 2px #888888;
}
.monaco-editor .detected-link-active {
  color: #4e94ce !important;
}
.monaco-editor .monaco-editor-overlaymessage .anchor {
  border-top-color: #64b5f6;
}
.monaco-editor .monaco-editor-overlaymessage .message {
  border: 1px solid #64b5f6;
}
.monaco-editor .monaco-editor-overlaymessage .message {
  background-color: rgba(100, 181, 246, 0.95);
}
.monaco-editor .parameter-hints-widget {
  border: 1px solid #5f7e97;
}
.monaco-editor .parameter-hints-widget.multiple .body {
  border-left: 1px solid rgba(95, 126, 151, 0.5);
}
.monaco-editor .parameter-hints-widget .signature.has-docs {
  border-bottom: 1px solid rgba(95, 126, 151, 0.5);
}
.monaco-editor .parameter-hints-widget {
  background-color: #011627;
}
.monaco-editor .parameter-hints-widget a {
  color: #4080d0;
}
.monaco-editor .parameter-hints-widget code {
  background-color: rgba(10, 10, 10, 0.4);
}
.monaco-editor
  .suggest-widget
  .monaco-list
  .monaco-list-row
  .monaco-highlighted-label
  .highlight {
  color: #ffffff;
}
.monaco-editor .suggest-widget {
  color: #d6deeb;
}
.monaco-editor .suggest-widget a {
  color: #4080d0;
}
.monaco-editor .suggest-widget code {
  background-color: rgba(10, 10, 10, 0.4);
}
.monaco-editor .focused .selectionHighlight {
  background-color: rgba(95, 126, 151, 0.47);
}
.monaco-editor .selectionHighlight {
  background-color: rgba(95, 126, 151, 0.24);
}
.monaco-editor .wordHighlight {
  background-color: #32374d;
}
.monaco-editor .wordHighlightStrong {
  background-color: #2e3250;
}
.monaco-editor .findMatch {
  background-color: #2e3248;
}
.monaco-editor .currentFindMatch {
  background-color: rgba(95, 126, 151, 0.47);
}
.monaco-editor .findScope {
  background-color: rgba(58, 61, 65, 0.4);
}
.monaco-editor .find-widget {
  background-color: #31364a;
}
.monaco-editor .find-widget {
  box-shadow: 0 2px 8px #011627;
}
.monaco-editor .find-widget {
  border: 2px solid #122d42;
}
.monaco-editor .find-widget.no-results .matchesCount {
  color: #ef5350;
}
.monaco-editor .find-widget .monaco-sash {
  background-color: #262a39;
  width: 3px !important;
  margin-left: -4px;
}
.monaco-workbench .simple-find-part {
  background-color: #31364a !important;
}
.monaco-workbench .simple-find-part {
  box-shadow: 0 2px 8px #011627;
}
.monaco-editor .reference-zone-widget .ref-tree .referenceMatch {
  background-color: rgba(255, 255, 255, 0.8);
}
.monaco-editor .reference-zone-widget .preview .reference-decoration {
  background-color: rgba(126, 87, 194, 0.35);
}
.monaco-editor .reference-zone-widget .ref-tree .referenceMatch {
  border: 1px dotted #122d42;
  box-sizing: border-box;
}
.monaco-editor .reference-zone-widget .ref-tree {
  background-color: #011627;
}
.monaco-editor .reference-zone-widget .ref-tree {
  color: #5f7e97;
}
.monaco-editor .reference-zone-widget .ref-tree .reference-file {
  color: #5f7e97;
}
.monaco-editor
  .reference-zone-widget
  .ref-tree
  .monaco-tree.focused
  .monaco-tree-rows
  > .monaco-tree-row.selected:not(.highlighted) {
  background-color: #2e3250;
}
.monaco-editor
  .reference-zone-widget
  .ref-tree
  .monaco-tree.focused
  .monaco-tree-rows
  > .monaco-tree-row.selected:not(.highlighted) {
  color: #5f7e97 !important;
}
.monaco-editor
  .reference-zone-widget
  .preview
  .monaco-editor
  .monaco-editor-background,
.monaco-editor
  .reference-zone-widget
  .preview
  .monaco-editor
  .inputarea.ime-input {
  background-color: #011627;
}
.monaco-editor .reference-zone-widget .preview .monaco-editor .margin {
  background-color: #011627;
}
.monaco-editor .goto-definition-link {
  color: #4e94ce !important;
}
.quick-input-list .monaco-list .monaco-list-row.focused {
  background-color: #010d18;
}
.quick-input-list .monaco-list .monaco-list-row.focused:hover {
  background-color: #010d18;
}
.monaco-workbench
  .notifications-list-container
  .notification-list-item
  .notification-list-item-message
  a {
  color: #80cbc4;
}

.monaco-workbench
  .notifications-list-container
  .notification-list-item
  .notification-list-item-message
  a:focus {
  outline-color: #122d42;
}
.monaco-editor .accessibilityHelpWidget {
  background-color: #31364a;
}
.monaco-editor .accessibilityHelpWidget {
  box-shadow: 0 2px 8px #011627;
}
.monaco-editor .access…;
}`;
