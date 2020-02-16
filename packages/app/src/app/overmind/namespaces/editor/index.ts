// import { graphql } from '../../../overmind-graphql';
import * as actions from './actions';
import { state } from './state';

export { state, actions };

/*

// You need to export like this instead
export const editor = graphql({ state, actions }, {
  endpoint: "http://...", // It will automatically use ws:// for websocket
  params: ({ user }) => ({ // We get the state here to build the connection_init params
    jwt: user.jwt
  }),
  subscriptions: {
    collab: gql`
      subscription onNewItem {
          newItemCreated {
              id
          }
      }
    `
  }
});

- This adds effects to the "editor" namespace, so "effects.editor.subscriptions.collab()"
- It creates the websocket connection on the first subscription call
- Will need to review API surface a bit, but this should get us started :)
*/
