import React from 'react';

import { Option as Container, OptionName, CheckBox } from './elements';

export default ({ template, selected, toggleTemplate }) => {
  const name = `${template.name}-checkbox`;
  return (
    <Container
      selected={selected}
      onClick={e => {
        e.preventDefault();
        toggleTemplate(template.name, !selected);
      }}
      onMouseDown={e => {
        e.preventDefault();
      }}
    >
      <label htmlFor={name} type="checkbox" style={{ display: 'none' }} />
      <CheckBox id={name} template={template} selected={selected} />
      <OptionName style={{ fontWeight: 500 }}>{template.niceName}</OptionName>
    </Container>
  );
};
