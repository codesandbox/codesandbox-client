import React from 'react';
import { connect } from 'react-redux';

import type { Module } from '../../../../../store/entities/modules';
import Tab from './Tab';
import { singleModuleSelector } from '../../../../../store/entities/modules/selector';

type Props = {
  module: Module;
  moduleId: string;
};

const mapStateProps = (state, props) => ({
  module: singleModuleSelector(state, { id: props.moduleId }),
});
const ModuleTab = ({ module, ...props }: Props) => (module ? (
  <Tab title={module.title} {...props} />
) : null);

export default connect(mapStateProps)(ModuleTab);
