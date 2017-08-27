import React from 'react';
import styled from 'styled-components';
import Button from 'app/components/buttons/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background};
  color: rgba(255, 255, 255, 0.8);
  padding: 0.75rem;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 500;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0 !important;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 0;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  button {
    display: flex;
    justify-content: center;
    width: 6rem;
    margin: 0.5rem;
  }
`;

type Props = {
  filename: string,
  onCancel: Function,
  onDelete: Function
};

const DeleteFile = ({ filename, onCancel, onDelete }: Props) =>
  <Container>
    <Title>Delete</Title>

    <Text>
      Are you sure you want to delete <b>{filename}</b>? The file will be
      permanently removed.
    </Text>

    <Buttons>
      <Button small block onClick={onCancel}>
        Cancel
      </Button>
      <Button small block red onClick={onDelete}>
        Delete
      </Button>
    </Buttons>
  </Container>;

export default DeleteFile;
