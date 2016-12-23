import React from 'react';
import { routerContext } from 'react-router/PropTypes';

import Centered from '../../../components/flex/Centered';
import Title from '../../../components/text/Title';
import SubTitle from '../../../components/text/SubTitle';
import type { Sandbox } from '../../../store/entities/sandboxes/';
import { editModuleUrl } from '../../../utils/url-generator';

type Props = {
  sandbox: Sandbox;
  forkSandbox: (id: string) => void;
};
type State = {
  error: Error,
};
export default class Fork extends React.PureComponent {
  static contextTypes = {
    router: routerContext,
  }
  componentDidMount() {
    this.forkSandbox();
  }

  props: Props;
  state: State;

  forkSandbox = async () => {
    const { sandbox } = this.props;
    const result = await this.props.forkSandbox(sandbox.id);

    if (result instanceof Error) {
      this.context.router.transitionTo(sandbox);
    } else {
      const username = result.entity.author ? result.entity.author.username : null;
      const url = editModuleUrl({ ...result.entity, author: username });
      this.context.router.transitionTo(url);
    }
  }

  render() {
    return (
      <Centered vertical horizontal>
        <Title delay={0}>Forking Sandbox</Title>
        <SubTitle delay={0.1}>Copying files...</SubTitle>
      </Centered>
    );
  }
}
