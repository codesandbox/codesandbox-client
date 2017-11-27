// @flow
import * as React from 'react';

import WorkspaceInputContainer from '../WorkspaceInputContainer';
import WorkspaceSubtitle from '../WorkspaceSubtitle';
import PreferenceDropdown from '../../../../../components/Preference/PreferenceDropdown';
import { TextArea } from '../../../../../components/Input';

// I'll move this if needed, just not sure the best place for it.
const PREPROCESSOR_TYPES = {
  css: {
    label: 'none',
    options: false,
  },
  postcss: {
    label: 'PostCSS',
    options: true,
    placeholder: `{ "use": [ require('postcss-cssnext') ] }`,
  },
  sass: {
    label: 'Sass',
    options: true,
    placeholder: `{ precision: 3 }`,
  },
  acss: {
    label: 'Atomic CSS',
    options: true,
    placeholder: `{ namespace: "#atomic" }`,
  },
  less: {
    label: 'Less',
    options: false,
  },
};

type Props = {
  // id: string,
  preprocessor: string,
  options?: string,
  // preventTransition: boolean,
};

export default class CSS extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      preprocessor: props.preprocessor || 'css',
      options: props.options,
    };
  }

  setValue = (field: string) => (value: string) => {
    // $FlowIssue
    this.setState({ [field]: value });
  };

  componentWillReceiveProps = (nextProps: Props) => {
    if (nextProps.preprocessor !== this.props.preprocessor) {
      this.setState({ preprocessor: nextProps.preprocessor });
    }
    if (nextProps.options !== this.props.options) {
      this.setState({ options: nextProps.options });
    }
  };

  getPreprocessor = current =>
    Object.entries(PREPROCESSOR_TYPES).filter(
      ([preprocessor, { label }]) => preprocessor === current && label
    )[(0)[0]];

  getPreprocessorLabel = label =>
    Object.keys(PREPROCESSOR_TYPES).reduce(
      (acc, type) => (PREPROCESSOR_TYPES[type].label === label ? type : acc),
      undefined
    );

  render() {
    return (
      <div>
        <WorkspaceSubtitle>Preprocessor</WorkspaceSubtitle>
        <WorkspaceInputContainer>
          <PreferenceDropdown
            value={this.getPreprocessor(this.state.preprocessor)}
            setValue={value =>
              this.setValue('preprocessor')(this.getPreprocessorLabel(value))
            }
            options={Object.entries(PREPROCESSOR_TYPES).map(
              ([, { label }]) => label
            )}
          />
        </WorkspaceInputContainer>

        {PREPROCESSOR_TYPES[this.state.preprocessor].options && [
          <WorkspaceSubtitle key="options-label">Options</WorkspaceSubtitle>,
          <WorkspaceInputContainer key="options-input">
            <TextArea
              rows="10"
              value={this.state.options}
              onChange={evt => this.setValue('options')(evt.target.value)}
              placeholder={
                PREPROCESSOR_TYPES[this.state.preprocessor].placeholder
              }
            />
          </WorkspaceInputContainer>,
        ]}
      </div>
    );
  }
}
