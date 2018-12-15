import styled from 'styled-components';
import Title from 'app/components/Title';

export const Heading = styled(Title)`
  margin-top: 3rem;
`;

export const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 1rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
`;

export const Buttons = styled.section`
  display: flex;
  justify-content: flex-end;
  margin: 3rem 0;
  align-items: center;
  position: relative;

  button:first-child {
    margin-left: 1rem;
  }

  button:not(:last-child) {
    margin-right: 1rem;
  }
`;

export const PickerWrapper = styled.div`
  position: absolute;
  z-index: 10;
  background: #1c2022;
  border-radius: 3px;
  top: 45px;
  right: 14px;
`;
