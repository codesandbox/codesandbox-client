// flow-typed signature: 4289f578eae9e926f15a7597e4322fcb
// flow-typed version: 72fd37b4b1/react-addons-css-transition-group_v15.x.x/flow_>=v0.53.x

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
  declare class ReactCSSTransitionGroup extends React$Component<Props> {
    static defaultProps: DefaultProps;
  }
  declare module.exports: Class<ReactCSSTransitionGroup>;
}
