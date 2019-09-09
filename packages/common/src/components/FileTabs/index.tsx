import React from 'react';
import { Container, Tab, Close } from './elements';

export function FileTabs({ files, ...props }) {
  return (
    <Container {...props}>
      {files.map(file => {
        return (
          <Tab key={file.id} aria-selected={file.selected}>
            {file.name} <Close />
          </Tab>
        );
      })}
    </Container>
  );
}
