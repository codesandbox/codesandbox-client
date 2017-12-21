import PropTypes from 'prop-types';

export const filePropTypes = {
  files: PropTypes.shape({
    path: PropTypes.shape({
      code: PropTypes.string.isRequired,
    }),
  }).isRequired,
  dependencies: PropTypes.objectOf(PropTypes.string),
  resources: PropTypes.arrayOf(PropTypes.string),
};
