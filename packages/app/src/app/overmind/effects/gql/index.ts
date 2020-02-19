import { graphql } from '../../../overmind-graphql';
import * as mutations from './collaborators/mutations';
import * as queries from './collaborators/queries';
import * as subscriptions from './collaborators/subscriptions';

export default graphql({
  subscriptions,
  queries,
  mutations,
});
