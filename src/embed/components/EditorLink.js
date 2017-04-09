import React from 'react';
import styled from 'styled-components';
import Logo from 'app/components/Logo';

type Props = {
  id: string,
};

const EditText = styled.a`
  text-decoration: none;
  display: flex;
  align-items: center;
  color: white;
  svg {
    margin-left: 0.5rem;
  }
`;

export default ({ id }: Props) => (
  <EditText target="_blank" rel="noopener noreferrer" href={`/s/${id}`}>
    Edit on CodeSandbox<Logo />
  </EditText>
);
