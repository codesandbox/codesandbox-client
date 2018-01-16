import React from 'react';

const ConfigWizard = ({ file }) => {
  let parsedFile;
  let error;
  try {
    parsedFile = JSON.parse(file);
  } catch (e) {
    error = e;
  }

  if (error) {
    return <div>Problem parsing file: {error.message}</div>;
  }

  return (
    <div>
      title: {parsedFile.name}
      description: {parsedFile.description}
    </div>
  );
};

export default {
  ConfigWizard,
};
