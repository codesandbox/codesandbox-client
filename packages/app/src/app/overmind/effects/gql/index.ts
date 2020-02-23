import { graphql } from '../../../overmind-graphql';
import * as mutations from './mutations';
import * as queries from './queries';
import * as subscriptions from './subscriptions';

export default graphql({
  subscriptions,
  queries,
  mutations,
});
