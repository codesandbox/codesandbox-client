// flow-typed signature: 79b0d9e0a2b9916a7ee8fd46cc9fe92b
// flow-typed version: 898a5a203f/react-modal_v1.x.x/flow_>=v0.26.x

declare module 'react-modal' {
  declare type DefaultProps = {
    isOpen: bool,
    ariaHideApp: bool,
    closeTimeoutMS: number,
    shouldCloseOnOverlayClick: bool,
  }
  declare type Props = {
    isOpen: bool,
    style?: {
      content?: Object,
      overlay?: Object,
    },
    appElement?: HTMLElement,
    ariaHideApp: bool,
    closeTimeoutMS: number,
    onAfterOpen?: () => mixed,
    onRequestClose?: (event: Event) => mixed,
    shouldCloseOnOverlayClick: bool,
  }
  declare class Modal extends React$Component {
    static setAppElement(element: HTMLElement | string): void;
    static defaultProps: DefaultProps;
    props: Props;
  }
  declare var exports: typeof Modal;
}
