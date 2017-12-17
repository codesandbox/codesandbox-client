import React from 'react';

export interface Props {
  hello: string;
}

export default class Playground extends React.Component<Props> {
  render() {
    return <div>Hey hai</div>;
  }
}
