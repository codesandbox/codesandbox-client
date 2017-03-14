// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Preview from './subviews/Preview';
import { directoriesBySandboxSelector } from '../../../../../store/entities/directories/selector';
import { modulesBySandboxSelector, singleModuleSelector } from '../../../../../store/entities/modules/selector';
import { singleSourceSelector } from '../../../../../store/entities/sources/selector';
import moduleEntity from '../../../../../store/entities/modules/';
import sourceEntity from '../../../../../store/entities/sources/';
import { boilerplatesBySandboxSelector } from '../../../../../store/entities/boilerplates/selector';

const mapStateToProps = (state, props) => ({
  directories: directoriesBySandboxSelector(state, { id: props.sandbox.id }),
  modules: modulesBySandboxSelector(state, { id: props.sandbox.id }),
  module: singleModuleSelector(state, { id: props.tab ? props.tab.moduleId : null }),
  bundle: singleSourceSelector(state, { id: props.sandbox.source }).bundle,
  boilerplates: boilerplatesBySandboxSelector(state, { id: props.sandbox.id }),
});
const mapDispatchToProps = dispatch => ({
  setError: bindActionCreators(moduleEntity.actions, dispatch).setError,
  fetchBundle: bindActionCreators(sourceEntity.actions, dispatch).fetchBundle,
});

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
