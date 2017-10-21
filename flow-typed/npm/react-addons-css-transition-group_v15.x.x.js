// flow-typed signature: a5d420be59219309de3639554ba77a94
// flow-typed version: 72fd37b4b1/react-addons-css-transition-group_v15.x.x/flow_>=v0.26.x <=v0.52.x

declare module 'react-addons-css-transition-group' {
  declare type ReactCSSTransitionGroupNames = {
    enter?: string,
    enterActive?: string,
    leave?: string,
    leaveActive?: string,
    appear?: string,
    appearActive?: string,
  };
  declare type Props = {
    transitionName: string | ReactCSSTransitionGroupNames,
    transitionAppear?: boolean,
    transitionEnter?: boolean,
    transitionLeave?: boolean,
    transitionAppearTimeout?: number,
    transitionEnterTimeout?: number,
    transitionLeaveTimeout?: number,
  };
  declare type DefaultProps = {
    transitionAppear: boolean,
    transitionEnter: boolean,
    transitionLeave: boolean,
  };
  declare class ReactCSSTransitionGroup extends React$Component<
    DefaultProps,
    Props,
    any
  > {
    props: Props,
    static defaultProps: DefaultProps,
  }
  declare module.exports: Class<ReactCSSTransitionGroup>;
}
