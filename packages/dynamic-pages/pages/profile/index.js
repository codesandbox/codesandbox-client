import React from 'react';
import fetch from '../../utils/fetch';

export default class extends React.Component {
  static async getInitialProps({ query, req }) {
    const profile = await fetch(req, `/api/v1/users/${query.username}`);
    return { profile };
  }

  render() {
    return (
      <div>
        Welcome <pre>{JSON.stringify(this.props.profile)}</pre>!
      </div>
    );
  }
}
