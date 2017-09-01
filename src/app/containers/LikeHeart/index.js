import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import { loggedInSelector } from 'app/store/user/selectors';
import { singleSandboxSelector } from 'app/store/entities/sandboxes/selectors';

import LikeHeart from './LikeHeart';

const mapStateToProps = createSelector(
  loggedInSelector,
  (state, props) => singleSandboxSelector(state, { id: props.sandboxId }),
  (loggedIn, sandbox) => ({
    loggedIn,
    sandboxId: sandbox.id,
    isLiked: sandbox.userLiked,
  })
);
const mapDispatchToProps = dispatch => ({
  likeSandbox: bindActionCreators(sandboxActionCreators.likeSandbox, dispatch),
  unLikeSandbox: bindActionCreators(
    sandboxActionCreators.unLikeSandbox,
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(LikeHeart);
